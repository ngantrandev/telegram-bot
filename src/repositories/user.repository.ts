import { User } from 'node-telegram-bot-api';

import UserModel from '@/models/user.model.js';

/**
 *
 * @param user
 * @returns void
 * @description Create a new user. If the user already exists, it will not be created.
 */
const createUser = async (user: User) => {
  try {
    const userExists = await UserModel.findOne({ id: user.id });

    if (userExists) {
      console.log(`User id ${user.id} already exists`);
      return;
    }

    const newUser = new UserModel(user);
    await newUser.save();
  } catch (error) {
    console.error(error);
  }
};

const getUserById = async (userId: number) => {
  try {
    const user = await UserModel.findOne({ id: userId });
    return user;
  } catch (error) {
    console.error(error);
  }
};

const updateUserById = async (userId: number, user: User) => {
  try {
    await UserModel.updateOne({ id: userId }, user);
  } catch (error) {
    console.error(error);
  }
};

const deleteUserById = async (userId: number) => {
  try {
    await UserModel.deleteOne({ id: userId });
  } catch (error) {
    console.error(error);
  }
};

export const userRepositories = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
