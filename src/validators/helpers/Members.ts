import MemberInterface from "../../interfaces/MemberInterface";

export const isNotArrayWithLength = (members: any) => {
  return (
    typeof members !== "object" ||
    (typeof members === "object" &&
      (members.length === 0 || members.length === undefined))
  );
};

export const validRole = (role: string) => {
  return role === "Leader" || role === "Member" || role === "Viewer";
};

export const areRolesValid = (members: Array<MemberInterface>) => {
  return members.every(({ role }) => validRole(role));
};

export const membersHaveAllParams = (members: Array<MemberInterface>) => {
  if (members.some((member) => member === undefined)) return false;

  return members.every((member) => member.member && member.role);
};
