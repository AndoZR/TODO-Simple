export class Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;

  constructor(title: string) {
    this.id = Date.now();
    this.title = title;
    this.completed = false;
    this.createdAt = new Date();
  }
}



