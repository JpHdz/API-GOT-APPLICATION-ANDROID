const sharp = require('sharp');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');
const User = require('./../models/userModel');

exports.getAllUsers = factory.getAll(User);
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messaje: 'This route is not defined! Please use sign up instead',
  });
};

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.addScore = catchAsync(async (req, res, next) => {
  // 1) Check if both parameters were added
  const { category } = req.body;
  const { score } = req.body;

  if (!score || !category)
    return next(
      new AppError('Please provide both category and score values!', 400),
    );

  // Do the validation and update

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const existingScore = user.bestScores.find((el) => el.category === category);

  if (existingScore) {
    if (score > existingScore.score) {
      existingScore.score = score; // Update the score
      await user.save();
      return res.status(200).json({ message: 'Score updated.', user });
    } else {
      return res
        .status(200)
        .json({ message: 'Score not higher. No changes made.', user });
    }
  } else {
    user.bestScores.push({ score, category }); // Add new score
    await user.save();
    return res.status(201).json({ message: 'Score added.', user });
  }
});
