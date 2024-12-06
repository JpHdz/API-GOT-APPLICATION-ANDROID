const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const usersRouter = express.Router();

usersRouter.route('/addScore/:id').post(userController.addScore);

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);
usersRouter.post('/logout', authController.logout);

usersRouter.use(authController.protect);

usersRouter.use(authController.restrictTo('admin'));

usersRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
usersRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = usersRouter;
