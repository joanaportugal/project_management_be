import ProjectInterface from "../../interfaces/ProjectInterface";

export const hasAllParams = (body: ProjectInterface) => {
  return (
    body.description && body.icon && body.name && body.owner && body.status
  );
};

export const isIconValid = (icon: string) => {
  return /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim.test(icon);
};

export const isStatusValid = (status: string) => {
  return (
    status === "In Progress" || status === "Completed" || status === "On Hold"
  );
};
