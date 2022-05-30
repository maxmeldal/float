export interface Task {
  id: string | undefined;
  name: string;
  description: string | undefined;
  bucketId: string;
  color: string | undefined;
}
