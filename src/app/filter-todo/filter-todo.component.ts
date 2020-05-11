import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import IUser from '../service/IUser';

@Component({
  selector: 'app-filter-todo',
  templateUrl: './filter-todo.component.html',
  styleUrls: ['./filter-todo.component.scss']
})
export class FilterTodoComponent implements OnInit {

  constructor() { }

  @Input() users: IUser[];
  @Output() filterTodoList = new EventEmitter<boolean>();
  @Output() filterTodoByAuthor = new EventEmitter<Event>();

  onFilterTodoList(filterValue?: boolean) {
    this.filterTodoList.emit(filterValue);
  }

  onFilterTodoByAuthor(event) {
    this.filterTodoByAuthor.emit(event);
  }

  ngOnInit(): void {
  }

}
