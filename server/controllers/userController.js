import User from '../models/UserModel.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import sendToken from '../utils/sendToken.js';
import Notification from '../models/NotificationModel.js';

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      // return next(new ErrorHandler('All fields are required!', 400));
    }

    let user = await User.findOne({ email });

    // if (user) return next(new ErrorHandler('User already exists!', 400));

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    let myCloud;

    if (avatar) {
      myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'avatars',
      });
    }

    const userNameWithoutSpace = name.replace(/\s/g, '');
    const randomNumber = Math.floor(Math.random() * 1000);

    user = await User.create({
      name,
      email,
      password: hashPassword,
      username: userNameWithoutSpace + randomNumber,
      avatar: avatar
        ? { public_id: myCloud.public_id, url: myCloud.secure_url }
        : null,
    });

    // await user.save();

    sendToken(user, 201, res);
  } catch (error) {
    // return next(new ErrorHandler('Error registering user!', 404));
  }
};

// Log user in
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return next(new ErrorHandler('All fields are required!', 400));
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'User does not exist!' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ message: 'Invalid credentials!' });

    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ success: true, message: error.message });
  }
};

// Get the current user
export const loadUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ success: true, user });
};

// Get all users

export const getAllUsers = async (req, res, next) => {
  try {
    const loggedInUser = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUser } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error.message);
    // return next(new ErrorHandler('Unable to get users', 400));
  }
};

// Get a single user

export const getSingleUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error, 'error backend');
    console.log(error.message, 'errorMessage backend');
    // return next(new ErrorHandler(error.message, 401));
  }
};

// Follow and unfollow users

export const followUnfollowUsers = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const { userToFollowId } = req.body;

    const isFollowedAlready = loggedInUser.following.find(
      (user) => user.userId === userToFollowId
    );

    if (isFollowedAlready) {
      await User.findByIdAndUpdate(userToFollowId, {
        $pull: { followers: { userId: loggedInUser._id } },
      });

      await User.findByIdAndUpdate(loggedInUser._id, {
        $pull: { following: { userId: userToFollowId } },
      });

      await Notification.deleteOne({
        'creator._id': loggedInUser._id,
        type: 'unfollow',
        userId: userToFollowId,
      });

      res
        .status(200)
        .json({ success: true, message: 'User unfollowed successfully' });
    } else {
      await User.findByIdAndUpdate(userToFollowId, {
        $push: { followers: { userId: loggedInUser._id } },
      });

      await User.findByIdAndUpdate(loggedInUser._id, {
        $push: { following: { userId: userToFollowId } },
      });

      await Notification.create({
        creator: req.user,
        type: 'follow',
        title: 'followed you',
        userId: userToFollowId,
      });

      res
        .status(200)
        .json({ success: true, message: 'User followed successfully' });
    }
  } catch (error) {
    console.log(error.message, 'error message');
  }
};

// Get all notifications

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    // return next(new ErrorHandler(error.message, 401));
  }
};

// Edit user profile
export const editProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    user.name = req.body.name;
    user.username = req.body.userName;
    user.bio = req.body.bio;

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message, 'error message');
  }
};
