import MemberInterface from "./MemberInterface";

interface ProjectInterface {
  name: string;
  icon: string;
  description: string;
  status: string;
  owner: string;
  members: Array<MemberInterface>;
}

export default ProjectInterface;
