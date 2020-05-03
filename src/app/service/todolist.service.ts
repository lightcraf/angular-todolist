import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ITodo from './ITodo';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) { }

  getTodoList() {
    return this.firestore.collection('todoList').snapshotChanges();
  }

  updateTodoList(todo: ITodo) {
    return this.firestore.collection('todoList').doc(`${todo.id}`).update(todo);
  }

  addTodoList(todo: ITodo) {
    this.firestore.collection('todoList').doc(`${todo.id}`).set(todo);
  }

  deleteTodoList(todo: ITodo) {
    this.firestore.collection('todoList').doc(`${todo.id}`).delete();
  }
}
