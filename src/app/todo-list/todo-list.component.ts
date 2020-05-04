import { Component, OnInit, ViewChild } from '@angular/core';
import ITodo from '../service/ITodo';
import { TodolistService } from '../service/todolist.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { filter, map, max, toArray } from 'rxjs/operators';
import {Observable, from} from 'rxjs';

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

  displayedColumns: string[] = ['select', 'index', 'username', 'created', 'dueDate', 'title', 'action'];
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
      newTodoList = from(this.todoList).pipe(
        filter(vl => vl.completed),
        toArray()
       )
    } else if (filterValue === 'undone') {
      newTodoList = from(this.todoList).pipe(
        filter(vl => !vl.completed),
        toArray()
       )
    } else if (filterValue === 'all') {
      newTodoList = from(this.todoList).pipe(
        filter(vl => vl.completed || !vl.completed),
        toArray()
       )
    } else if (filterValue === 'title') {
      newTodoList = from(this.todoList).pipe(
        filter(vl => vl.title.indexOf(searchValue) !== -1),
        toArray()
       )
    }

    newTodoList.subscribe(vl => this.dataSource.data = vl);
  }

  addTodo(form): void {
    let maxId: number = 1;
    from(this.todoList).pipe(
      map(vl => vl.id),
      max()
     ).subscribe(vl => maxId = vl);

    const newTodo: ITodo = {
      userId: this.addTodoForm.value.author.userId,
      id: maxId + 1,
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
    const foundIndex: number = this.todoList.findIndex(item => item.id === this.prevRowData.id);
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
