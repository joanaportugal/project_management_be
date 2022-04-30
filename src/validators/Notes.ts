import NoteInterface from "../interfaces/NoteInterface";

export const hasAllParams = (body: NoteInterface) => {
  return body.description && body.member && body.title
    ? ""
    : "Please provide description, member and title!";
};

export const isIdInvalid = (id: string) => {
  return !parseInt(id) ? `Project id must be an integer number!` : "";
};

export const titleQueryInvalid = (title: any) => {
  return !title
    ? "Please provide a title query!"
    : typeof title !== "string"
    ? "Title query must be a string!"
    : "";
};
