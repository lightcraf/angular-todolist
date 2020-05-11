import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import IUser from '../service/IUser';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  addTodoForm = this.formBuilder.group({
    todoTitle: ['', [Validators.required, Validators.minLength(1)]],
    dueDate: ['', [Validators.required]],
    author: ['', [Validators.required]]
  });

  minDate: Date = new Date();
  maxDate: Date = new Date(2020, 5, 30);

  constructor(
    private formBuilder: FormBuilder
  ) { }

  @Input() users: IUser[];
  @Output() addTodo = new EventEmitter<any>();

  onAddTodo(form) {
    const newTodo = {
      userId: this.addTodoForm.value.author.userId,
      username: this.addTodoForm.value.author.username,
      title: this.addTodoForm.value.todoTitle,
      dueDate: Date.parse(this.addTodoForm.value.dueDate)
    };

    this.addTodo.emit(newTodo);
    form.resetForm();
  }

  ngOnInit(): void {
  }

}
