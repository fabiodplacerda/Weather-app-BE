import expressValidator from "express-validator";

export default class UserValidator {
  static validate = () => {
    try {
      return [
        expressValidator.body("_id").optional().isMongoId(),
        expressValidator
          .body("email")
          .notEmpty()
          .isString()
          .withMessage("email is required")
          .isEmail()
          .withMessage("invalid email format"),
        expressValidator
          .body("name")
          .notEmpty()
          .isString()
          .withMessage("name is required")
          .isLength({ min: 3 })
          .withMessage("name must be at least 3 characters long"),
        expressValidator
          .body("password")
          .notEmpty()
          .isString()
          .withMessage("password is required")
          .isLength({ min: 8 })
          .withMessage("password must be at least 8 characters long")
          .matches(/(?=.*[A-Z])/)
          .withMessage("password must contain at least one uppercase letter")
          .matches(/(?=.*\d)/)
          .withMessage("password must contain at least one number")
          .matches(/(?=.*[@$!%*?&])/)
          .withMessage("password must contain at least one special character"),
        expressValidator.body("favouriteCities").optional().isArray(),
        UserValidator.handleValidationErrors,
      ];
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  static validatePassword = () => {
    try {
      return [
        expressValidator
          .body("password")
          .notEmpty()
          .isString()
          .withMessage("password is required")
          .isLength({ min: 8 })
          .withMessage("password must be at least 8 characters long")
          .matches(/(?=.*[A-Z])/)
          .withMessage("password must contain at least one uppercase letter")
          .matches(/(?=.*\d)/)
          .withMessage("password must contain at least one number")
          .matches(/(?=.*[@$!%*?&])/)
          .withMessage("password must contain at least one special character"),
        UserValidator.handleValidationErrors,
      ];
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  static handleValidationErrors = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
}
