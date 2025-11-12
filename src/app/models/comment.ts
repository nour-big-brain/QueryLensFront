export interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: number | string | Date; // backend sends timestamp (number)
}