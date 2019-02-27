import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-operacion-terminado',
  templateUrl: './add-edit-operacion-terminado.component.html',
  styleUrls: ['./add-edit-operacion-terminado.component.css']
})
export class AddEditOperacionTerminadoComponent implements OnInit {
  @ViewChild('clave_edit') claveFieldEdit: ElementRef;
  @ViewChild('nombre_edit') nombreFieldEdit: ElementRef;
  formEdit: FormGroup;
  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  constructor(private _toast: ToastrService,
              public dialogRef: MatDialogRef<AddEditOperacionTerminadoComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    this.initFormGroupEdit();
  }

  initFormGroupEdit() {
    this.formEdit = new FormGroup({
      'ID': new FormControl(''),
      'IdUsuario': new FormControl(this.json_Usuario.ID),
      'Clave': new FormControl('', [Validators.required]),
      'Nombre': new FormControl(''),
      'Descripcion': new FormControl('', [Validators.required]),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar() {
    if (this.formEdit.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de defecto terminado', '');
      this.claveFieldEdit.nativeElement.focus();
    } else if (this.formEdit.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de defecto', '');
      this.nombreFieldEdit.nativeElement.focus();
    }
  }

  updateTextFields() {
    // this.nombreFieldEdit.nativeElement.focus();
    this.nombreFieldEdit.nativeElement.focus();
    this.claveFieldEdit.nativeElement.focus();
  }

}
