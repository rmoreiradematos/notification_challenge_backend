import { ErrorRequestHandler } from "express";
import { CustomValidationError } from "../errors/CustomValidationError";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomValidationError) {
    const messages = err.errors
      .flatMap((e) => Object.values(e.constraints ?? {}))
      .join(", ");
    return res
      .status(400)
      .json({ message: "Validation failed", errors: messages });
  } else {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default errorHandler;
