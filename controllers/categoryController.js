const factory = require('./handleFactory');
const Category = require('./../models/categoryModel');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const sharp = require('sharp');
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);

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

exports.uploadCategoryImage = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizeCategoryImage = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();
  console.log(req.files.image[0]);
  // 1) Cover image
  req.body.image = `category-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.image[0].buffer)
    .resize(1920, 1080)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/categories/${req.body.image}`);

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
