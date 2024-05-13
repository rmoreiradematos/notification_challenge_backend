import { ValidationError } from "class-validator";

export class CustomValidationError extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Validation failed");
    this.errors = errors;
    this.name = "CustomValidationError";
  }
}
