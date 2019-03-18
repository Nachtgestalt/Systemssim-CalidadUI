import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {PosicionTerminadoService} from '../services/terminado/posicion-terminado.service';

import 'jquery';
import {Router} from '@angular/router';
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
  posiciones = [];

  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private _toast: ToastrService,
              public _terminadoPosicionService: PosicionTerminadoService,
              public router: Router) {
  }

  ngOnInit() {
    const mensaje = (this.router.url === '/quality/calidad-posicion' ? 'Calidad - Posición' : 'Terminado - Posición');
    $('#lblModulo').text(mensaje);
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
    $('#modalNewPosicionTerminado').modal();
    $('#modalEditPosicionTerminado').modal();
    $('#modalEnablePosicionTerminado').modal();
    this.getPosicionesTerminado();
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
      'Nombre': new FormControl('', [Validators.required]),
      'Descripcion': new FormControl(''),
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
      'Clave': new FormControl('', [Validators.required]),
      'Nombre': new FormControl('', [Validators.required]),
    });
  }

  NewPosicionTerminado() {
    console.log(this.form.value);
    if (this.form.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de posicion', '');
      this.claveField.nativeElement.focus();
    } else if (this.form.get('Nombre').invalid) {
      this._toast.warning('Se debe ingresar el campo posición', '');
      this.nombreField.nativeElement.focus();
    }

    this._terminadoPosicionService.createPosicion(this.form.value)
      .subscribe(
        (res: any) => {
          console.log('RESPUESTA DE CREATE POSICION TERMINADO: ', res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente la posición', '');
            $('#modalNewPosicionTerminado').modal('close');
            this.getPosicionesTerminado();
            this.initFormGroup();
          } else {
            this._toast.warning('Ha ocurrido un error al agregar posición', '');
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getPosicionesTerminado() {
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

    this._terminadoPosicionService.listPosiciones(clave, defecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.posiciones = res.c_posicion_t;
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

  getInfoPosicionTerminado(id) {
    this._terminadoPosicionService.getPosicion(id)
      .subscribe(
        (res: any) => {
          this.updateTextFields();
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.formEdit.patchValue(res.c_posicion_t);
            this.updateTextFields();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  editPosicionTerminado() {
    if (this.formEdit.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de posición', '');
      this.claveFieldEdit.nativeElement.focus();
    } else if (this.formEdit.get('Nombre').invalid) {
      this._toast.warning('Se debe ingresar el campo posición', '');
      this.nombreFieldEdit.nativeElement.focus();
    }
    this._terminadoPosicionService.updatePosicion(this.formEdit.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se agrego correctamente la posición', '');
            $('#modalEditPosicionTerminado').modal('close');
            this.getPosicionesTerminado();
            this.initFormGroupEdit();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  GetEnabledPosicionTerminado() {
    this._terminadoPosicionService.inactivaActiva(this.idPosicion)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se inactivó correctamente el defecto terminado', '');
            $('#modalEnablePosicionTerminado').modal('close');
            this.getPosicionesTerminado();
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
