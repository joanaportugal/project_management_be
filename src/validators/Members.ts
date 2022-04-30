import * as MembersValidators from "./helpers/Members";

export const getAddMembersErrors = (members: any) => {
  return MembersValidators.isNotArrayWithLength(members)
    ? "Please provide a list of members"
    : !MembersValidators.membersHaveAllParams(members)
    ? "Please provide member and role for the members."
    : !MembersValidators.areRolesValid(members)
    ? "Valid roles are: Leader, Member or Viewer"
    : "";
};

export const isIdInvalid = (id: string) => {
  return !parseInt(id) ? "Project id must be an integer number!" : "";
};

export const isEditRoleInvalid = (role: string) => {
  return !MembersValidators.validRole(role)
    ? "Valid roles are: Leader, Member or Viewer"
    : "";
};
