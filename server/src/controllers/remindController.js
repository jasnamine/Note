import { StatusCodes } from "http-status-codes";
import remindService from "../services/remindService";

const createReminder = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    const { time, repeat } = req.body;
    console.log(time);

    const response = await remindService.createReminder(
      userId,
      noteId,
      time,
      repeat
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const createMultipleReminders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { noteId, reminders } = req.body;

    const response = await remindService.createMultipleReminders(
      userId,
      noteId,
      reminders
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const updateReminder = async (req, res, next) => {
  try {
    const reminderId = req.params.id;
    const userId = req.user.id;
    const noteId = req.params.noteId;
    const { time, repeat } = req.body;

    const response = await remindService.updateReminder(
      userId,
      noteId,
      reminderId,
      time,
      repeat
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteReminder = async (req, res, next) => {
  try {
    const reminderId = req.params.id;
    const noteId = req.params.noteId;
    const userId = req.user.id;

    const response = await remindService.deleteReminder(
      userId,
      noteId,
      reminderId
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReminder,
  createMultipleReminders,
  updateReminder,
  deleteReminder,
};
