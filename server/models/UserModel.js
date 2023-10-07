import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Please enter your name!'],
    },

    bio: {
      type: String,
    },

    username: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: [true, 'Please enter your name!'],
    },

    password: {
      type: String,
      require: [true, 'Please enter your name!'],
      minLength: [5, 'Password must be more than 4'],
    },

    avatar: {
      public_id: {
        type: String,
        require: [true, 'Please upload a picture!'],
      },
      url: {
        type: String,
        require: [true, 'You need to upload a picture!'],
      },
    },

    followers: [
      {
        userId: {
          type: String,
        },
      },
    ],

    following: [
      {
        userId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
