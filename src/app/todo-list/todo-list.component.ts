import { Component, OnInit, ViewChild } from '@angular/core';
import ITodo from '../service/ITodo';
import { TodolistService } from '../service/todolist.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoList: ITodo[];
  users: {userId: number; username: string;}[];

  addTodoForm = this.formBuilder.group({
    newTodo: ['', [Validators.required, Validators.minLength(1)]],
    newDueDate: ['', [Validators.required]],
    author: ['', [Validators.required]]
  });
  searchForm = this.formBuilder.group({
    searchValue: ['']
  });

  activeRowId: number;
  prevRowData: ITodo;
  isEditActive: boolean = false;

  minDate = new Date();
  maxDate = new Date(2020, 5, 30);

  displayedColumns: string[] = ['select', 'id', 'username', 'created', 'dueDate', 'title', 'action'];
  selection = new SelectionModel<ITodo>(true, []);
  dataSource = new MatTableDataSource<ITodo>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private todoService: TodolistService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.todoService.getTodoList().subscribe(data => {
      this.todoList = data.map(item => {
        return item.payload.doc.data() as ITodo;
      }).sort((a,b) => a.id - b.id);

      this.users = this.todoList.map(item => {
        return { 'userId': item.userId, 'username': item.username };
      }).filter((thing, index, self) => self
        .findIndex(t => t.username === thing.username && t.userId === thing.userId) === index);

      this.dataSource = new MatTableDataSource(this.todoList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  filterTodoList(filterValue: string): void {
    const searchValue = this.searchForm.value.searchValue.trim().toLowerCase();
    let newTodoList = null;
    if (filterValue === 'done') {
      newTodoList = this.todoList.filter(item => {
        return item.completed;
      });
    } else if (filterValue === 'undone') {
      newTodoList = this.todoList.filter(item => {
        return !item.completed;
      });
    } else if (filterValue === 'all') {
      newTodoList = this.todoList.filter(item => {
        return item.completed || !item.completed;
      });
    } else if (filterValue === 'title') {
      newTodoList = this.todoList.filter(item => {
        return item.title.indexOf(searchValue) !== -1;
      });
    }

    this.dataSource.data = newTodoList;
  }

  addTodo(form): void {
    const newTodo = {
      userId: this.addTodoForm.value.author.userId,
      id: this.todoList.length + 1,
      username: this.addTodoForm.value.author.username,
      title: this.addTodoForm.value.newTodo,
      completed: false,
      created: Date.now(),
      dueDate: Date.parse(this.addTodoForm.value.newDueDate)
    };

    this.todoService.addTodoList(newTodo);
    form.resetForm()
  }

  editTodoItem(todo: ITodo): void {
    this.activeRowId = todo.id;
    this.isEditActive = !this.isEditActive;

    if (this.isEditActive) {
      this.prevRowData = Object.assign({}, todo);
    } else {
      this.cancelTodoItem();
    }
  }

  saveTodoItem(todo: ITodo): void {
    if (todo.id === this.prevRowData.id) {
      this.activeRowId = -1;
      this.isEditActive = false;
      this.prevRowData = Object.assign({}, todo);

      this.todoService.updateTodoList(todo);
    }
  }

  cancelTodoItem(): void {
    const foundIndex = this.todoList.findIndex(item => item.id === this.prevRowData.id);
    this.todoList[foundIndex] = this.prevRowData;
    this.dataSource.data = this.todoList;
    this.activeRowId = -1;
    this.isEditActive = false;
  }

  deleteTodoItem(todo: ITodo): void {
    this.activeRowId = -1;
    this.isEditActive = false;
    this.todoService.deleteTodoList(todo);
  }

  toggleCompleted(todo: ITodo): void {
    this.todoService.updateTodoList(todo);
  }

  checkboxLabel(row?: ITodo): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
