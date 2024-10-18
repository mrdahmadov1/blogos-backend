const mongoose = require('mongoose');
const User = require('./userModel');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Post title can not be empty!'],
    },
    content: {
      type: String,
      required: [true, 'Post content can not be empty!'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
