const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
  },
  image: {
    type: String,
    default: 'default.jpeg',
  },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
