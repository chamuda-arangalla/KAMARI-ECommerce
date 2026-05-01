import generateToken from "./generateToken.js";

const sendAuthResponse = (res, statusCode, message, user) => {
  const token = generateToken(user);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      isActive: user.isActive,
    },
  });
};

export default sendAuthResponse;