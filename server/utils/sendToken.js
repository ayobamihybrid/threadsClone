import jwt from 'jsonwebtoken';

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ user, token });
};

export default sendToken;
