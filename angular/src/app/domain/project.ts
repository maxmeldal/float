export interface Project {
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  createdAt: Date | undefined;
  deadline: Date | undefined;
  hourEstimate: number | undefined;
  price: number | undefined;
  userId: string | undefined;
}
