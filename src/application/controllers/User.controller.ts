import express from "express";
import { UserService } from "../services/User.service";
import { UserDto } from "../dtos/UserDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";
import { authenticate } from "../middlewares/Authenticate";

export const userRouter = express.Router();
const userService = new UserService();

userRouter.post("/", async (req, res, next) => {
  try {
    const userDto = plainToInstance(UserDto, req.body);
    const errors = await validate(userDto);
    if (errors.length > 0) {
      return next(new CustomValidationError(errors));
    }
    const user = await userService.createUser(userDto);
    const { password, ...returnedUser } = user;
    res.status(201).json(returnedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", authenticate, async (req, res) => {
  try {
    const user = await userService.getUsers();
    if (user) {
      const returnedUser = user.map((user) => {
        const { password, ...returnedUser } = user;
        return returnedUser;
      });
      res.json(returnedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error });
  }
});

userRouter.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    if (user) {
      const { password, ...returnedUser } = user;
      res.json(returnedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error });
  }
});
