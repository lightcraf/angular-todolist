import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-todo',
  templateUrl: './search-todo.component.html',
  styleUrls: ['./search-todo.component.scss']
})
export class SearchTodoComponent implements OnInit {
  searchForm = this.formBuilder.group({
    searchValue: ['']
  });
  
  constructor(
    private formBuilder: FormBuilder
  ) { }

  @Output() searchTodo = new EventEmitter<string>();

  onSearchTodo() {
    const searchValue = this.searchForm.value.searchValue.trim().toLowerCase();
    this.searchTodo.emit(searchValue);
  }

  ngOnInit(): void {
  }

}
