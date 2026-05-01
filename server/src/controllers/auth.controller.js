import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import buildCustomerAddress from "../utils/buildCustomerAddress.js";
import sendAuthResponse from "../utils/sendAuthResponse.js";

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
    const {
      username,
      firstName,
      lastName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      district,
      postalCode,
    } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
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

    // define addresses
    const addresses = buildCustomerAddress({
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      district,
      postalCode,
    });

    const customer = await User.create({
      username: normalizedUsername,
      role: "customer",
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || null,
      phone: phone || null,
      addresses, // now correct
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

// CUSTOMER LOGIN - username only
export const loginCustomer = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const customer = await User.findOne({
      username: normalizedUsername,
      role: "customer",
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found. Please register first.",
      });
    }

    if (!customer.isActive) {
      return res.status(403).json({
        success: false,
        message: "Customer account is inactive",
      });
    }

    return sendAuthResponse(res, 200, "Customer login successful", customer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Customer login failed",
      error: error.message,
    });
  }
};