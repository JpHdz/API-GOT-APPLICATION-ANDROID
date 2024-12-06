const express = require('express');
const questionController = require('./../controllers/questionController');

const questionsRouter = express.Router();

questionsRouter
  .route('/')
  .get(questionController.getAllQuestions)
  .post(questionController.createQuestion);

questionsRouter
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(
    questionController.uploadQuizImages,
    questionController.resizeQuizImages,
    questionController.updateQuestion,
  )
  .delete(questionController.deleteQuestion);

module.exports = questionsRouter;
