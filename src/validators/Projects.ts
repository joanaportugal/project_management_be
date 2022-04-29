import ProjectInterface from "../interfaces/ProjectInterface";
import * as ProjectsValidators from "./helpers/Projects";

export const geProjectCreateErrors = (body: ProjectInterface) => {
  if (!ProjectsValidators.hasAllParams(body)) {
    return "Please provide description, icon, name, owner and status!";
  } else if (!ProjectsValidators.isIconValid(body.icon)) {
    return "Please provide a valid image url for the icon!";
  } else if (!ProjectsValidators.isStatusValid(body.status)) {
    return "Please provide a valid status (In Progress/Completed/On Hold)!";
  }
  return "";
};

export const getProjectUpdateErrors = (body: ProjectInterface) => {
  return !ProjectsValidators.hasAllParams(body)
    ? "Please provide description, icon, name, owner and status!"
    : "";
};
