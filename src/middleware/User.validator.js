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

  static validateFavouriteCities = () => {
    try {
      return [
        expressValidator.body("_id").optional().isMongoId(),
        expressValidator
          .body("newFavouriteCity.city")
          .notEmpty()
          .isString()
          .withMessage("City is required and must be a string"),
        expressValidator
          .body("newFavouriteCity.country")
          .notEmpty()
          .isString()
          .withMessage("Country is required and must be a string"),
        expressValidator
          .body("newFavouriteCity.latitude")
          .notEmpty()
          .isNumeric()
          .withMessage("Latitude is required and must be a number"),
        expressValidator
          .body("newFavouriteCity.longitude")
          .notEmpty()
          .isNumeric()
          .withMessage("Longitude is required and must be a number"),
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
