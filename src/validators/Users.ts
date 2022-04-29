import UserInterface from "../interfaces/UserInterface";
import * as UsersValidators from "./helpers/Users";

export const getUsersRegisterErrors = (body: UserInterface) => {
  if (!UsersValidators.hasAllParams(body, "register")) {
    return "Please provide email, name, password and username!";
  } else if (!UsersValidators.isEmailValid(body.email)) {
    return "Please provide a valid email address!";
  } else if (!UsersValidators.isUsernameValid(body.username)) {
    return "A valid username should start with a letter. Your username can have letters, numbers and underscores. Your username must have between 6 and 20 characters.";
  } else if (!UsersValidators.isPasswordValid(body.password)) {
    return "A valid password should have at least one uppercase letter, one lowercase letter and one number. Your password must have between 8 and 20 characters.";
  }
  return "";
};

export const getUsersLoginErrors = (body: UserInterface) => {
  if (!UsersValidators.hasAllParams(body, "login")) {
    return "Please provide email or username and password!";
  }
  return "";
};

export const getUsersUpdateErrors = (body: UserInterface) => {
  if (!UsersValidators.hasAllParams(body, "update")) {
    return "Please provide a avatar or password to update!";
  }
  if (body.avatar && !UsersValidators.isAvatarValid(body.avatar)) {
    return "Please provide a valid image url for the avatar!";
  } else if (body.password && !UsersValidators.isPasswordValid(body.password)) {
    return "A valid password should have at least one uppercase letter, one lowercase letter and one number. Your password must have between 8 and 20 characters.";
  }
  return "";
};
