import UserInterface from "../../interfaces/UserInterface";

export const hasAllParams = (body: UserInterface, authType: string) => {
  switch (authType) {
    case "register":
      return body.email && body.name && body.password && body.username;
    case "login":
      return (body.email || body.username) && body.password;
    case "update":
      return body.avatar || body.password;

    default:
      return "";
  }
};

export const isEmailValid = (email: string) => {
  return /^[0-9a-zA-Z.+_]+@[0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/.test(email);
};

export const isUsernameValid = (username: string) => {
  return /^[A-Za-z][A-Za-z0-9_]{5,19}$/.test(username);
};

export const isPasswordValid = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(password);
};

export const isAvatarValid = (avatar: string) => {
  return /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim.test(avatar);
};

export const arePasswordsEqual = (
  lastPassword: string,
  newPassword: string
) => {
  return lastPassword === newPassword;
};
