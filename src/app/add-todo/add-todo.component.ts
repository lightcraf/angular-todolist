import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  maxDate: Date = new Date(2022, 5, 30);

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onAddTodo(form): void {
    const newTodo = {
      userId: this.addTodoForm.value.author.userId,
      username: this.addTodoForm.value.author.username,
      title: this.addTodoForm.value.todoTitle,
      dueDate: Date.parse(this.addTodoForm.value.dueDate)
    };

    this.dialogRef.close(newTodo);
    form.resetForm();
  }

  closeDialog(): void {
    this.dialogRef.close('close');
  }
}
