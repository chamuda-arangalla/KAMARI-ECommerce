import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendAuthResponse from "../utils/sendAuthResponse.js";

export const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ADMIN REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
      role: "admin",
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || null,
      phone: phone || null,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin registration failed",
      error: error.message,
    });
  }
};

// UNIFIED LOGIN — works for both admin and customer
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return sendAuthResponse(res, 200, "Login successful", user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const admin = await User.findOne({
      username: normalizedUsername,
      role: "admin",
    });

    if (!admin || !admin.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    return sendAuthResponse(res, 200, "Admin login successful", admin);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};

// CUSTOMER REGISTER
export const registerCustomer = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer",
      firstName: firstName || "",
      lastName: lastName || "",
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      user: {
        id: customer._id,
        username: customer.username,
        role: customer.role,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses,
        isActive: customer.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Customer registration failed",
      error: error.message,
    });
  }
};

// CUSTOMER LOGIN
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const customer = await User.findOne({
      email: normalizedEmail,
      role: "customer",
    });

    if (!customer || !customer.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!customer.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return sendAuthResponse(res, 200, "Login successful", customer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Customer login failed",
      error: error.message,
    });
  }
};
