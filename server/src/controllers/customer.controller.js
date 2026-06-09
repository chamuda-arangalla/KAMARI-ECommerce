import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const isValidUserId = (id) => mongoose.Types.ObjectId.isValid(id);

const serializeCustomer = (customer) => ({
  id: customer._id,
  role: customer.role,
  firstName: customer.firstName,
  lastName: customer.lastName,
  email: customer.email,
  phone: customer.phone,
  addresses: customer.addresses,
  isActive: customer.isActive,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

const buildCheckoutAddress = ({
  fullName,
  firstName,
  lastName,
  phone,
  addressLine1,
  addressLine2,
  city,
  district,
  province,
  postalCode,
  country,
}) => ({
  fullName: fullName || `${firstName || ""} ${lastName || ""}`.trim(),
  phone,
  addressLine1,
  addressLine2: addressLine2 || "",
  city,
  district,
  province: province || "",
  postalCode: postalCode || "",
  country: country || "Sri Lanka",
  isDefault: true,
});

export const updateCheckoutAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      district,
      province,
      postalCode,
      country,
    } = req.body;

    if (req.user?.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Customer access only",
      });
    }

    if (!phone || !addressLine1 || !district) {
      return res.status(400).json({
        success: false,
        message: "Phone, address line 1, and district are required",
      });
    }

    const customer = await User.findOne({
      _id: req.user.id,
      role: "customer",
      isActive: true,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const checkoutAddress = buildCheckoutAddress({
      fullName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone,
      addressLine1,
      addressLine2,
      city: city || district,
      district,
      province,
      postalCode,
      country,
    });

    customer.phone = phone;
    customer.addresses = [
      checkoutAddress,
      ...customer.addresses.filter((address) => !address.isDefault),
    ];

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Checkout address updated successfully",
      user: {
        id: customer._id,
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
      message: "Failed to update checkout address",
      error: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.user.id,
      role: "customer",
      isActive: true,
    }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeCustomer(customer),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.user.id,
      role: "customer",
      isActive: true,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      addresses,
      currentPassword,
      password,
    } = req.body;

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const existingEmail = await User.findOne({
        _id: { $ne: customer._id },
        email: normalizedEmail,
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Another account already uses this email",
        });
      }

      customer.email = normalizedEmail;
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required",
        });
      }

      const passwordMatches = await bcrypt.compare(currentPassword, customer.password);

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      customer.password = await bcrypt.hash(password, 10);
    }

    if (firstName !== undefined) customer.firstName = firstName;
    if (lastName !== undefined) customer.lastName = lastName;
    if (phone !== undefined) customer.phone = phone || null;
    if (Array.isArray(addresses)) customer.addresses = addresses;

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: serializeCustomer(customer),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, addresses, isActive } = req.body;

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

    const customer = await User.create({
      firstName: firstName || "",
      lastName: lastName || "",
      email: normalizedEmail,
      phone: phone || null,
      password: await bcrypt.hash(password, 10),
      role: "customer",
      addresses: Array.isArray(addresses) ? addresses : [],
      isActive: isActive === undefined ? true : isActive === true || isActive === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: serializeCustomer(customer),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer", isActive: true })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers.map(serializeCustomer),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUserId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customer = await User.findOne({ _id: id, role: "customer" }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeCustomer(customer),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUserId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customer = await User.findOne({ _id: id, role: "customer" });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const { firstName, lastName, email, phone, password, addresses, isActive } = req.body;

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const existingEmail = await User.findOne({
        _id: { $ne: customer._id },
        email: normalizedEmail,
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Another account already uses this email",
        });
      }

      customer.email = normalizedEmail;
    }

    if (firstName !== undefined) customer.firstName = firstName;
    if (lastName !== undefined) customer.lastName = lastName;
    if (phone !== undefined) customer.phone = phone || null;
    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      customer.password = await bcrypt.hash(password, 10);
    }
    if (Array.isArray(addresses)) customer.addresses = addresses;
    if (isActive !== undefined) customer.isActive = isActive === true || isActive === "true";

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: serializeCustomer(customer),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUserId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customer = await User.findOne({ _id: id, role: "customer", isActive: true });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.isActive = false;
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: { id: customer._id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};
