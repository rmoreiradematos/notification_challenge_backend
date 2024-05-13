import express from "express";
import { ChannelService } from "../services/Channel.service";
import { ChannelDto } from "../dtos/ChannelDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";
import { ChanelUpdateDto } from "../dtos/ChannelUpdateDto";

export const channelRouter = express.Router();
const channelService = new ChannelService();

channelRouter.post("/", async (req, res, next) => {
  try {
    const channelDto = plainToInstance(ChannelDto, req.body);
    const errors = await validate(channelDto);
    if (errors.length > 0) {
      next(new CustomValidationError(errors));
    }

    const channel = await channelService.createChannel(channelDto);
    res.status(201).json(channel);
  } catch (error) {
    next(error);
  }
});

channelRouter.get("/", async (req, res) => {
  try {
    const channel = await channelService.getChannels();
    if (channel) {
      res.json(channel);
    } else {
      res.status(404).json({ message: "channel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving channel", error: error });
  }
});

channelRouter.get("/:id", async (req, res) => {
  try {
    const channel = await channelService.getChannelById(
      parseInt(req.params.id)
    );
    if (channel) {
      res.json(channel);
    } else {
      res.status(404).json({ message: "channel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving channel", error: error });
  }
});

channelRouter.put("/:id", async (req, res, next) => {
  try {
    const channelDto = plainToInstance(ChanelUpdateDto, req.body);
    const errors = await validate(channelDto);
    if (errors.length > 0) {
      next(new CustomValidationError(errors));
    }

    const validateIfExists = await channelService.getChannelById(
      parseInt(req.params.id)
    );
    if (!validateIfExists) {
      res.status(404).json({ message: "channel not found" });
    }
    const channel = await channelService.updateChannel(
      parseInt(req.params.id),
      channelDto
    );
    res.json(channel);
  } catch (error) {
    next(error);
  }
});

channelRouter.delete("/:id", async (req, res) => {
  try {
    await channelService.deleteChannel(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting channel", error: error });
  }
});
