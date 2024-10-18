const mongoose = require('mongoose');
const User = require('./userModel');

const postSchema = new mongoose.Schema(
  {
    userId: {
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

postSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const user = await User.findById(this.userId);
  if (!user) return next(new Error('User not found!'));

  user.posts.push({ postId: this._id, title: this.title });
  await user.save();

  next();
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'username',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
