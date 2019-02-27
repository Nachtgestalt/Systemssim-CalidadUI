import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {OperacionesService} from '../services/terminado/operaciones.service';

import 'jquery';
declare var $: any;

@Component({
  selector: 'app-terminado-posicion',
  templateUrl: './terminado-posicion.component.html',
  styleUrls: ['./terminado-posicion.component.css']
})
export class TerminadoPosicionComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('clave') claveField: ElementRef;
  @ViewChild('nombre') nombreField: ElementRef;
  @ViewChild('clave_edit') claveFieldEdit: ElementRef;
  @ViewChild('nombre_edit') nombreFieldEdit: ElementRef;
  @ViewChild('descripcion_edit') descripcionFieldEdit: ElementRef;
  @ViewChild('tblDefectosTerminado') tblDefectos: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  form: FormGroup;
  formEdit: FormGroup;
  formSearch: FormGroup;
  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  idPosicion;
  operaciones = [];

  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private _toast: ToastrService,
              public _terminadoOperacionesService: OperacionesService) {
  }

  ngOnInit() {
    $('#lblModulo').text('Terminado - Posición');
    this.dtOptions = {
      language: {
        processing: 'Procesando...',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ elementos',
        info: '_START_ - _END_ de _TOTAL_ elementos',
        infoEmpty: 'Mostrando ningún elemento.',
        infoFiltered: '(filtrado _MAX_ elementos total)',
        infoPostFix: '',
        loadingRecords: 'Cargando registros...',
        zeroRecords: 'No se encontraron registros',
        emptyTable: 'No hay datos disponibles en la tabla',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último'
        },
      }
    };
    this.initFormGroup();
    this.initFormGroupEdit();
    $('.tooltipped').tooltip();
    $('#modalNewDefectoTerminado').modal();
    $('#modalEditDefectoTerminado').modal();
    $('#modalEnableDefectoTerminado').modal();
    this.getOperacionesTerminado();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'IdSubModulo': new FormControl(1),
      'IdUsuario': new FormControl(this.json_Usuario.ID),
      'Clave': new FormControl(null, [Validators.required]),
      'Nombre': new FormControl(''),
      'Descripcion': new FormControl('', [Validators.required]),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(''),
    });

    this.formSearch = new FormGroup({
      'clave': new FormControl(''),
      'defecto': new FormControl('')
    });
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

  NewOperacionTerminado() {
    console.log(this.form.value);
    if (this.form.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de operacion terminado', '');
      this.claveField.nativeElement.focus();
    } else if (this.form.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de operación', '');
      this.nombreField.nativeElement.focus();
    }

    this.form.get('Imagen').patchValue(($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src));

    this._terminadoOperacionesService.createOperacion(this.form.value)
      .subscribe(
        (res: any) => {
          console.log('RESPUESTA DE CREATE DEFECTO TERMINADO: ', res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente el defecto terminado', '');
            $('#modalNewDefectoTerminado').modal('close');
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getOperacionesTerminado() {
    let clave = '';
    let defecto = '';
    if (this.formSearch.get('clave').value !== '' && this.formSearch.get('defecto').value === '') {
      clave = this.formSearch.get('clave').value;
    } else if (this.formSearch.get('clave').value === '' && this.formSearch.get('defecto').value !== '') {
      defecto = this.formSearch.get('defecto').value;
    } else {
      clave = this.formSearch.get('clave').value;
      defecto = this.formSearch.get('defecto').value;
    }

    this._terminadoOperacionesService.listOperaciones(clave, defecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.operaciones = res.Vst_Terminado;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getInfoOperacionTerminado(id) {
    this._terminadoOperacionesService.getOperacion(id)
      .subscribe(
        (res: any) => {
          this.updateTextFields();
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.formEdit.patchValue(res.Vst_Terminado);
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  editOperacionTerminado() {
    if (this.formEdit.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de defecto terminado', '');
      this.claveFieldEdit.nativeElement.focus();
    } else if (this.formEdit.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de defecto', '');
      this.nombreFieldEdit.nativeElement.focus();
    }
    this.formEdit.get('Imagen').patchValue(($('#blahEdit')[0].src === 'http://placehold.it/180' ? '' : $('#blahEdit')[0].src));
    this._terminadoOperacionesService.updateOperacion(this.formEdit.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente el defecto terminado', '');
            $('#modalEditDefectoTerminado').modal('close');
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  GetEnabledOperacionTerminado() {
    this._terminadoOperacionesService.inactivaActiva(this.idPosicion)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se inactivó correctamente el defecto terminado', '');
            $('#modalEnableDefectoTerminado').modal('close');
            this.getOperacionesTerminado();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  cambiarID(id) {
    this.idPosicion = id;
    console.log(this.idPosicion);
  }

  updateTextFields() {
    // this.nombreFieldEdit.nativeElement.focus();
    this.descripcionFieldEdit.nativeElement.focus();
    this.claveFieldEdit.nativeElement.focus();
  }
}
