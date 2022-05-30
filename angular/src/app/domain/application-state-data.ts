import {Project} from "./project";
import {Bucket} from "./bucket";
import {User} from "./user";

export interface ApplicationStateData {
  apiUrl: string;

  user: User | undefined;

  projects: Project[];
  wantedProjectId: string | undefined;
  selectedProject: Project | undefined;

  buckets: Bucket[];
}
