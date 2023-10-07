import Notification from '../models/NotificationModel.js';
import Post from '../models/PostModel.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import cloudinary from 'cloudinary';

export const createPost = async (req, res, next) => {
  try {
    // const { image } = req.body;

    // let myCloud;
    // if (image) {
    //   myCloud = await cloudinary.v2.uploader.upload(image, {
    //     folder: 'posts',
    //   });
    // }

    let threads = req.body.threads.map((thread) => {
      if (thread.image) {
        const threadImage = cloudinary.v2.uploader.upload(thread.image, {
          folder: 'posts',
        });

        thread.image = {
          public_id: threadImage.public_id,
          url: threadImage.secure_url,
        };
      }
      return thread;
    });

    const post = new Post({
      user: req.body.user,
      title: req.body.title,
      threads,
      image: '',
      //   image: image
      //     ? { public_id: myCloud.public_id, url: myCloud.secure_url }
      //     : null,
    });

    await post.save();

    res.status(201).json({ message: 'Post created successfully', post: post });
  } catch (error) {
    console.error('Error creating post:', error);
    // return next(new ErrorHandler(error.message, 400));
  }
};

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    // return next(new ErrorHandler(error.message, 400));
    console.log(error);
  }
};

// like and unlike posts
export const likeUnlikePost = async (req, res, next) => {
  const user = req.user;
  const { postId } = req.body;

  const post = await Post.findById(postId);

  const isLikedAlready = post.likes.find(
    (p) => p.userId === user._id.toString()
  );

  if (isLikedAlready) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: { userId: user._id.toString() } },
    });

    await Notification.deleteOne({
      'creator._id': user._id,
      type: 'unliked',
      postId,
    });

    res
      .status(200)
      .json({ success: true, message: 'Post unliked successfully' });
  } else {
    await Post.findByIdAndUpdate(postId, {
      $push: {
        likes: {
          name: user.name,
          userName: user.username,
          userId: user._id.toString(),
          userAvatar: user.avatar?.url,
        },
      },
    });

    if (user._id.toString() !== post.user._id) {
      await Notification.create({
        creator: user,
        type: 'Liked',
        title: 'Liked your post',
        postId,
        userId: post.user._id,
      });
    }

    res.status(201).json({ success: true, message: 'Post liked successfully' });
  }
};

// Enable reply to Posts
export const handlePostReply = async (req, res, next) => {
  try {
    const { postId } = req.body;

    // myCloud;
    // if (req.body.image) {
    //   myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //     folder: 'posts',
    //   });
    // }

    const replyData = {
      user: req.user,
      title: req.body.title,
      // image: req.body.image
      //   ? { public_id: myCloud.public_id, url: myCloud.secure_url }
      //   : null,
      likes: [],
    };

    let post = await Post.findById(postId);
    if (!post) {
      // return next(new ErrorHandler(error.message, 400));
    }

    post.threads.push(replyData);

    await post.save();

    res.status(201).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating reply' });
  }
};

// Like and unlike threads/replies
export const likeUnlikeReplies = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { threadId } = req.body;

    let post = await Post.findById(postId);
    if (!post) {
      // return next(new ErrorHandler(error.message, 404));
      return res.status(400).json({ message: 'post not found' });
    }

    let thread = await post.threads.find(
      (thread) => thread._id.toString() === threadId
    );

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found',
      });
    }

    const isLikedAlready = thread.likes.find(
      (like) => like.userId === req.user._id.toString()
    );

    // if (isLikedAlready) {
    //   await findByIdAndUpdate(thread._id, {
    //     $pull: { likes: { userId: req.user._id } },
    //   });
    // }

    if (isLikedAlready) {
      thread.likes = thread.likes.filter(
        (like) => like.userId !== req.user._id.toString()
      );

      await post.save();

      if (req.user._id.toString() !== post.user._id) {
        await Notification.deleteOne({
          'creator._id': req.user._id,
          type: 'unliked',
          postId,
        });
      }

      res.status(200).json({ message: 'Reply unliked successfully' });
    } else {
      thread.likes.push({
        name: req.user.name,
        username: req.user.username,
        userId: req.user._id.toString(),
        userAvatar: '',
      });

      await post.save();

      if (req.user._id.toString() !== post.user._id) {
        await Notification.create({
          creator: req.user,
          type: 'Like',
          title: thread.title,
          userId: post.user._id,
          postId,
        });
      }

      res
        .status(200)
        .json({ success: true, message: 'reply liked successfully' });
    }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 400));
    // return res.status(400).json({ message: 'Error liking post' });
    console.log(error, 'error backend');
    console.log(error.message, 'errorMessage backend');
  }
};

// Add replies to threads/replies

export const addReplyToThreads = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { threadId } = req.body;

    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    let thread = post.threads.find(
      (thread) => thread._id.toString() === threadId
    );
    if (!thread) return res.status(400).json({ message: 'reply not foundddd' });

    // myCloud;
    // if (req.body.image) {
    //   myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //     folder: 'posts',
    //   });
    // }

    const replyData = {
      user: req.user,
      title: req.body.title,
      // image: req.body.image
      //   ? { url: myCloud.secure_url, public_id: myCloud.public_id }
      //   : null,
      likes: [],
    };

    thread.reply.push(replyData);

    await post.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(404).json({
      message: 'Bad request',
    });
  }
};

// Add likes to threads replies
export const likeUnlikeThreadReply = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { threadId } = req.body;
    const { threadReplyId } = req.body;

    let post = await Post.findById(postId);
    if (!post) {
      // return next(new ErrorHandler(error.message, 404));
      return res.status(400).json({ message: 'post not found' });
    }

    let thread = await post.threads.find(
      (thread) => thread._id.toString() === threadId
    );

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found for likes',
      });
    }

    let threadReply = await thread.reply.find(
      (replies) => replies._id.toString() === threadReplyId
    );

    if (!threadReply) {
      return res.status(404).json({
        success: false,
        message: 'Thread reply not found',
      });
    }

    const isThreadReplyLikedAlready = threadReply.likes.find(
      (like) => like.userId === req.user._id.toString()
    );

    if (isThreadReplyLikedAlready) {
      threadReply.likes = threadReply.likes.filter(
        (like) => like.userId !== req.user._id.toString()
      );

      await post.save();

      if (req.user._id.toString() !== threadReply.user._id.toString()) {
        await Notification.deleteOne({
          'creator._id': req.user,
          type: 'unLike',
          postId,
        });
      }

      res
        .status(200)
        .json({ success: true, message: 'Thread reply unliked successfully!' });
    } else {
      const threadReplyData = {
        name: req.user.name,
        userName: req.user.username,
        userId: req.user._id.toString(),
        userAvatar: '',
      };
      threadReply.likes.push(threadReplyData);

      await post.save();

      if (req.user._id.toString() !== threadReply.user._id.toString()) {
        await Notification.create({
          creator: req.user,
          type: 'Like',
          title: threadReply.title,
          userId: threadReply.user._id,
          postId,
        });

        res
          .status(200)
          .json({ success: true, message: 'Thread reply likes successfully' });
      }
    }
  } catch (error) {
    console.log(error.message, 'error message');
  }
};

// Add replies to threads replies

export const addReplyToThreadsReply = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { threadId } = req.body;
    const { replyId } = req.body;

    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    let thread = await post.threads.find(
      (thread) => thread._id.toString() === threadId
    );
    if (!thread) return res.status(400).json({ message: 'thread not found' });

    let reply = await thread.reply.find(
      (replies) => replies._id.toString() === replyId
    );
    if (!reply)
      return res.status(400).json({ message: 'Thread reply not found' });

    // myCloud;
    // if (req.body.image) {
    //   myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //     folder: 'posts',
    //   });
    // }

    const replyData = {
      user: req.user,
      title: req.body.title,
      // image: req.body.image
      //   ? { url: myCloud.secure_url, public_id: myCloud.public_id }
      //   : null,
      likes: [],
    };

    reply.replies.push(replyData);

    await post.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(404).json({
      message: 'Bad request',
    });
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // if(post.image?.public_id){
    //   await cloudinary.v2.uploader.destroy(post.image.public_id);
    //  }

    await Post.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {}
};
