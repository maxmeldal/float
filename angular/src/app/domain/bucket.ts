import {Task} from "./task";

export interface Bucket {
  id: string;
  name: string;
  projectId: string;
  tasks: Task[];
}
