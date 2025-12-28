// src/utils/validation.js
import Joi from "joi";

/**
 * Validation schemas for API endpoints
 */

// User registration (sign-up)
export const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().min(1).max(100).required(),
});

// User login
export const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Post creation
export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  media_url: Joi.string().uri().allow(null, "").optional(),
  comments_enabled: Joi.boolean().default(true),
  scheduled_at: Joi.string().isoDate().optional(), // ⭐ added for your scheduler
});

/**
 * Middleware to validate request body against schema
 * @param {Joi.Schema} schema - Joi validation schema
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((detail) => detail.message),
      });
    }

    req.validatedData = value; // optional: gives sanitized data
    next();
  };
};
