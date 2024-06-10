import * as expressValidator from "express-validator";

export default class FavouriteCityValidator {
  static validate = () => {
    try {
      return [
        expressValidator.body("_id").optional().isMongoId(),
        expressValidator
          .body("cityName")
          .notEmpty()
          .isString()
          .withMessage("city name is required"),
        expressValidator
          .body("cityCountry")
          .notEmpty()
          .isString()
          .withMessage("city country is required"),
        FavouriteCityValidator.handleValidationErrors,
      ];
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  static handleValidationErrors = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  };
}
