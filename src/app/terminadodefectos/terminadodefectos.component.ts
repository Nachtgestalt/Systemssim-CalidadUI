import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import 'jquery';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TerminadoService} from '../services/terminado/terminado.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-terminadodefectos',
  templateUrl: './terminadodefectos.component.html',
  styleUrls: ['./terminadodefectos.component.css']
})
export class TerminadodefectosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('clave') claveField: ElementRef;
  @ViewChild('nombre') nombreField: ElementRef;
  @ViewChild('clave_edit') claveFieldEdit: ElementRef;
  @ViewChild('nombre_edit') nombreFieldEdit: ElementRef;
  @ViewChild('descripcion_edit') descripcionFieldEdit: ElementRef;
  @ViewChild('tblDefectosTerminado') tblDefectos: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  formEdit: FormGroup;
  formSearch: FormGroup;
  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  defectos = [];
  idDefecto;

  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private _toast: ToastrService,
              public _terminadoService: TerminadoService
  ) {
  }

  ngOnInit() {
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
    $('#lblModulo').text('Terminado - Defectos');
    this.getDefectosTerminado();
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

  NewDefectoTerminado() {
    console.log(this.form.value);
    if (this.form.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de defecto terminado', '');
      this.claveField.nativeElement.focus();
    } else if (this.form.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de defecto', '');
      this.nombreField.nativeElement.focus();
    }

    this.form.get('Imagen').patchValue(($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src));

    this._terminadoService.createDefecto(this.form.value)
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

  getDefectosTerminado() {
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

    this._terminadoService.listDefectos(clave, defecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = res.Vst_Terminado;
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

  getInfoDefectoTerminado(id) {
    this._terminadoService.getDefecto(id)
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

  editDefectoTerminado() {
    if (this.formEdit.get('Clave').invalid) {
      this._toast.warning('Se debe ingresar una clave de defecto terminado', '');
      this.claveFieldEdit.nativeElement.focus();
    } else if (this.formEdit.get('Descripcion').invalid) {
      this._toast.warning('Se debe ingresar una descripción de defecto', '');
      this.nombreFieldEdit.nativeElement.focus();
    }
    this.formEdit.get('Imagen').patchValue(($('#blahEdit')[0].src === 'http://placehold.it/180' ? '' : $('#blahEdit')[0].src));
    this._terminadoService.updateDefecto(this.formEdit.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se modifico correctamente el defecto', '');
            $('#modalEditDefectoTerminado').modal('close');
            this.getDefectosTerminado();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  GetEnabledDefectoTerminado() {
    this._terminadoService.inactivaActiva(this.idDefecto)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se inactivó correctamente el defecto terminado', '');
            $('#modalEnableDefectoTerminado').modal('close');
            this.getDefectosTerminado();
          }
        },
        error1 => {
          console.log(error1);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  cambiarID(id) {
    this.idDefecto = id;
    console.log(this.idDefecto);
  }

  updateTextFields() {
    // this.nombreFieldEdit.nativeElement.focus();
    this.descripcionFieldEdit.nativeElement.focus();
    this.claveFieldEdit.nativeElement.focus();
  }
}
