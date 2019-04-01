import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
declare var jQuery: any;
import 'jquery';
import {ToastrService} from '../../../node_modules/ngx-toastr';
import {LavanderiaService} from '../services/lavanderia/lavanderia.service';
import {EMPTY, Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {switchMap} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-lavanderiaoperaciones',
  templateUrl: './lavanderiaoperaciones.component.html',
  styleUrls: ['./lavanderiaoperaciones.component.css']
})
export class LavanderiaoperacionesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();


  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  operaciones = [];

  // Formularios
  claveGuardar;
  nombreGuardar;

  form: FormGroup;

  constructor(
    private _toast: ToastrService,
    private _lavanderiaService: LavanderiaService
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
    $('#lblModulo').text('Lavandería - Operaciones');
    $('.tooltipped').tooltip();
    $('#modalEnableOperacionProcesosEspeciales').modal();
    $('#modalNewOperacionProcesosEspeciales').modal();
    $('#modalEditOperacionProcesosEspeciales').modal();
    this.GetOperacionLavanderia();
    this.initFormGroup();
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
      'IdSubModulo': new FormControl(19),
      'IdUsuario': new FormControl(this.json_Usuario.ID),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(),
      'Observaciones': new FormControl(),
      'Imagen': new FormControl(),
      'Defecto': new FormControl()
    });
  }

  DisposeNewOperacionProcesosEspeciales() {
    $('#CLAVE_NEW_OPERACION').val('');
    $('#DESCRIPCION_NEW_OPERACION').val('');
    $('#modalNewOperacionConfeccion').val('');
    $('#lblModulo').text('Procesos Especiales - Operaciones');
    // this.GetPosicionDefectosActivos();
  }

  GetOperacionLavanderia() {
    this._lavanderiaService.listOperaciones()
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.operaciones = res.Vst_Lavanderia;
            this.dtTrigger.next();
            // Call the dtTrigger to rerender again
          });
        }
      );
  }

  getDefectosActivos() {
    this._lavanderiaService.listDefectos('', '', 'True')
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res.Vst_Lavanderia);
        }
      );
  }

  EditOperacionProcesosEspeciales() {
    console.log('modulo');
  }

  NewOperacionProcesosEspeciales() {
    console.log(this.selection.selected);
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de operación para procesos especiales', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción de la operación para procesos especailes', '');
    } else {
      this._lavanderiaService.validaOperacionExiste(this.claveGuardar, this.nombreGuardar)
        .pipe(
          switchMap((res: any) => {
            if (res.Message.IsSuccessStatusCode) {
              this.form.controls['Defecto'].patchValue(this.selection.selected);
              return this._lavanderiaService.createOperacion(this.form.value);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe(
          res => {
            console.log(res);
          }
        );
    }
      // const Result = false;
      // $.ajax({
      //   // tslint:disable-next-line:max-line-length
      //   url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaOperacionSubModuloProcesosEspeciales?SubModulo=13&Clave=' + $('#CLAVE_NEW_OPERACION').val() + '&Nombre=' + $('#DESCRIPCION_NEW_OPERACION').val(),
      //   dataType: 'json',
      //   contents: 'application/json; charset=utf-8',
      //   method: 'get',
      //   async: false,
      //   success: function (json) {
      //     if (json.Message.IsSuccessStatusCode) {
      //       Result = json.Hecho;
      //     }
      //   },
      //   error: function () {
      //     console.log('No se pudo establecer conexión a la base de datos');
      //   }
      // });
      // if (Result) {
    //   let Mensaje = '';
    //   const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
    //   $.ajax({
    //     url: Globals.UriRioSulApi + 'Lavanderia/NuevaOperacionLavanderia',
    //     type: 'POST',
    //     contentType: 'application/json; charset=utf-8',
    //     async: false,
    //     data: JSON.stringify({
    //       IdSubModulo: 19,
    //       IdUsuario: Json_Usuario.ID,
    //       Clave: $('#CLAVE_NEW_OPERACION').val(),
    //       Nombre: $('#DESCRIPCION_NEW_OPERACION').val(),
    //       Descripcion: '',
    //       Observaciones: '',
    //       Imagen: $('#HDN_ARR').val()
    //     }),
    //     success: function (json) {
    //       if (json.Message.IsSuccessStatusCode) {
    //         Mensaje = 'Se agrego correctamente la operación de confección';
    //       }
    //     },
    //     error: function () {
    //       console.log('No se pudo establecer conexión a la base de datos');
    //     }
    //   });
    //   if (Mensaje !== '') {
    //     this._toast.success(Mensaje, '');
    //     $('#modalNewOperacionProcesosEspeciales').modal('close');
    //   }
    //   // } else {
    //   //   this._toast.warning('La clave de operación ya se encuentra registrada en el sistema', '');
    //   // }
    // }
  }

  GetEnabledOperacionProcesosEspeciales() {
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ActivaInactivaOperacionesProcesosEspeciales?IdOperacion=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableOperacionProcesosEspeciales').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetOperacionLavanderia();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
