const multer = require('multer');
const sharp = require('sharp');
const factory = require('./handleFactory');
const Question = require('./../models/questionModel');
const Category = require('./../models/categoryModel');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Multiple images with DIFFERENT names
exports.uploadQuizImages = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizeQuizImages = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();
  console.log(req.files.image[0]);
  // 1) Cover image
  req.body.image = `question-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.image[0].buffer)
    .resize(2000, 2000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/questions/${req.body.image}`);

  // // 2) Images
  // req.body.images = [];
  // // Have tu await all promises returned from map in order to really make our code async
  // await Promise.all(
  //   req.files.images.map(async (file, i) => {
  //     const filename = `question-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

  //     await sharp(file.buffer)
  //       .resize(2000, 1333)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`public/img/questions/${filename}`);

  // req.body.images.push(imageCover);
  //   }),
  // );

  next();
});

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const pipeline = [{ $match: {} }]; // Start with a match that selects all documents

  // Add category match stage if category is provided
  if (req.query.category && req.query.category !== 'allin') {
    pipeline.push(
      {
        $lookup: {
          from: 'categories', // typically the collection name (lowercase plural)
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $match: {
          'categoryDetails.name': req.query.category,
        },
      },
    );
  }

  const questions = await Question.aggregate(pipeline);

  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions,
    },
  });
});

exports.getQuestion = factory.getOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);
