import "jest";
import { validate as originalValidate } from "class-validator";

declare module "class-validator" {
  export const validate: jest.MockedFunction<typeof originalValidate>;
}
