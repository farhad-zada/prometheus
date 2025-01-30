const User = require("../models/userModel");
const logger = require("../utils/logger");
const { successResponse, errorResponse } = require("../utils/responseHandlers");
const validator = require("validator");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import("express").NextFunction} next
 * @returns {void | import("express").Response | import("express").NextFunction}
 */
async function me(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -passwordChangedAt -resetPasswordToken -resetPasswordExpires -__v"
    );
    return successResponse(res, user);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import("express").NextFunction} next
 * @returns {void | import("express").Response | import("express").NextFunction}
 */
async function updateMe(req, res, next) {
  try {
    const { name, lastname, phone, email } = req.body;
    if (phone && !validator.isMobilePhone(phone, "any")) {
      return errorResponse(res, `${phone} is not a valid phone number!`, 400);
    }
    if (email && !validator.isEmail(email)) {
      return errorResponse(res, `${email} is not a valid email address!`, 400);
    }
    const userData = { name, lastname, phone, email };

    const userUpdated = await User.findByIdAndUpdate(req.user._id, userData, {
      new: true,
      runValidators: true,
    }).select("+phone +email +name +role");
    successResponse(res, {user: userUpdated});
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
}

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @returns {void | import ('express').Response | import ('express').NextFunction}
 * @description add address for user
 */
const addAddress = async (req, res) => {
  try {
    if (!req.body.address) {
      return errorResponse(res, `address field is empty`, 400);
    }
    const {
      city,
      street,
      apartment,
      isPrimary,
    } = req.body.address;
    const user = req.user;
    if (!city && !street && !apartment) {
      return errorResponse("City, street or apartment should be provided!", 400);
    }
    user.addresses.push({
      city,
      street,
      apartment,
    });
    if (isPrimary) {
      user.addresses.forEach((address) => {
        address.isPrimary = false;
      });
      user.addresses[user.addresses.length - 1].isPrimary = true;
    }
    await user.save();
    successResponse(res, user, 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      return errorResponse(
        res,
        "Invalid input data. Please enter valid data! If you think this is a mistake, please contact us.",
        400
      );
    }
    errorResponse(res, error.message, 500);
  }
};

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @returns {void | import ('express').Response | import ('express').NextFunction}
 * @description add address for user
 */
const updateAddress = async (req, res) => {
  try {
    if (!req.body.address) {
      return errorResponse(res, `address field is empty`, 400);
    }
    const addressId  = req.params.id;
    const user = req.user;

    const {
      city,
      street,
      apartment,
      isPrimary,
    } = req.body.address;

    const addressExists = user.addresses.find((address) => address.id == addressId);
    if (!addressExists) {
      return errorResponse(res, "Address not found!", 404);
    }
    
    user.addresses.filter((address) => {
      if (address._id.toString() == addressId) {
        if (city) {
          address.city = city;
        } 
        if (street) {
          address.street = street;
        }
    
        if (apartment) {
          address.apartment = apartment;
        }
      }
    });


    if (isPrimary) {
      user.addresses.forEach((address) => {
        address.isPrimary = address._id.toString() == addressId;
      });
    }
    await user.save();
    successResponse(res, user, 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      return errorResponse(
        res,
        "Invalid input data. Please enter valid data! If you think this is a mistake, please contact us.",
        400
      );
    }
    errorResponse(res, error.message, 500);
  }
};

/**
 * @param {import ('express').Request} req
 * @param {import ('express').Response} res
 * @returns {void | import ('express').Response | import ('express').NextFunction}
 * @description remove address for user
 */
const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = req.user;
    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== addressId
    );
    await user.save();
    successResponse(res, user, 200);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};
module.exports = {
  me,
  updateMe,
  addAddress,
  updateAddress,
  removeAddress,
};
