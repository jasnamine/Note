const CustomError = require("../ultities/CustomError");
import { StatusCodes } from "http-status-codes";

const validate = (schema) => {
  return (req, res, next) => {
    const sources = ["body", "params", "query", "user", "files"];
    let errors = [];

    for (const source of sources) {
      if (schema[source]) {
        const { error, value } = schema[source].validate(req[source], {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          errors.push(...error.details.map((d) => `[${source}] ${d.message}`));
        } else {
          req[source] = value;
        }
      }
    }

    if (errors.length > 0) {
      throw new CustomError(errors.join(", "), StatusCodes.BAD_REQUEST);
    }
    next();
  };
};

module.exports = validate;
