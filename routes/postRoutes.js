const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/all', postController.getAllPosts);

router
  .route('/')
  .get(authController.restrictTo('user'), postController.getMyPosts)
  .post(authController.restrictTo('user'), postController.setUserIds, postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(authController.restrictTo('user'), postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
