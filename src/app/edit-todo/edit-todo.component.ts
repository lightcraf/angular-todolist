import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.scss']
})
export class EditTodoComponent implements OnInit {
  editTodoForm = this.formBuilder.group({
    todoTitle: [this.data.todo.title, [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onEditTodo(form): void {
    const newTodoTitle = {
      title: this.editTodoForm.value.todoTitle
    };

    this.dialogRef.close(newTodoTitle);
    form.resetForm();
  }

  closeDialog(): void {
    this.dialogRef.close('close');
  }
}
