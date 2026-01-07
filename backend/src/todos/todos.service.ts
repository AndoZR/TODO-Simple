import { Injectable } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private nextId = 1;

  findAll(search?: string): Todo[] {
    let result = [...this.todos];
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const todo = new Todo(createTodoDto.title);
    todo.id = this.nextId++;
    this.todos.push(todo);
    return todo;
  }

  findOne(id: number): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  toggleCompleted(id: number): Todo | null {
    const todo = this.findOne(id);
    if (!todo) {
      return null;
    }
    todo.completed = !todo.completed;
    return todo;
  }
}

