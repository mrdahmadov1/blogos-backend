const User = require('../models/userModel');
const Post = require('../models/postModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getPost = factory.getOne(Post);
exports.createPost = factory.createOne(Post);

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().select('title createdAt');

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: posts,
  });
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ user: req.user._id }).select('title createdAt');

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: posts,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  if (post.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this post', 403));
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedPost,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  if (post.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to delete this post', 403));
  }

  const updatedPost = await Post.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
