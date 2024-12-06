const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'A question must have a question'],
  },
  options: {
    type: [String],
    required: true,
    validate: [
      (array) => array.length === 4,
      'A question must have exactly 4 options',
    ],
  },
  correctOption: {
    type: String,
    required: [true, 'A question must have a correct option'],
    validate: [
      function (value) {
        return this.options.includes(value);
      },
      'Correct option must match to one element of options',
    ],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'A question must belong to a category'],
  },
  image: {
    type: String,
    default: 'default.jpeg',
  },
});

questionSchema.pre(/^find/, function (next) {
  this.populate({ path: 'category', select: 'name' });
  next();
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
