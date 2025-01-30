const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { errorResponse } = require("../utils/responseHandlers");
const User = require("../models/userModel");
const logger = require("../utils/logger");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import("express").Request} next
 * @returns {void | import("express").Response | import("express").NextFunction}
 */
const authMiddleware =
  (allow = false) =>
  async (req, res, next) => {
    let token;
    if (req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (token) {
      if (!token) {
        return errorResponse(res, "Access denied. Sign in required.", 401);
      }
      try {
        const decoded = jwt.verify(token, secret);

        const userId = decoded._id;
        if (!userId) {
          return errorResponse(res, "Invalid token.", 400);
        }

        const user = await User.findById(userId).select(
          "+passwordChangedAt +role"
        );

        if (!user) {
          return errorResponse(res, "Please sign in!", 404);
        } else if (
          user.passwordChangedAt &&
          user.passwordChangedAt.getTime() > decoded.iat * 1000
        ) {
          return errorResponse(res, "Password changed. Sign in again!", 401);
        }

        user.passwordChangedAt = undefined;
        req.user = user;
        next();
      } catch (error) {
        return errorResponse(res, "Invalid token.", 400);
      }
    } else if (allow) {
      next();
    } else {
      return errorResponse(res, "Access denied. Sign in required.", 401);
    }
  };

module.exports = authMiddleware;
