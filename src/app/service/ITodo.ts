export default interface ITodo {
  userId: number;
  id: number;
  username: string;
  title: string;
  completed: boolean;
  created: number;
  dueDate: number;
}