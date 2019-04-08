import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
declare var jQuery: any;
import 'jquery';
import {ToastrService} from '../../../node_modules/ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {EMPTY, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ProcesosEspecialesService} from '../services/procesos-especiales/procesos-especiales.service';
import swal from 'sweetalert';
import {map, switchMap, tap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-procesosespecialesoperaciones',
  templateUrl: './procesosespecialesoperaciones.component.html',
  styleUrls: ['./procesosespecialesoperaciones.component.css']
})
export class ProcesosespecialesoperacionesComponent implements OnInit, OnDestroy, AfterViewInit {
  dtOptions = {
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
  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  operaciones = [];

  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  idOperacion;
  formFilter: FormGroup;
  form: FormGroup;

  constructor(
    private _procesosService: ProcesosEspecialesService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalEnableOperacionProcesosEspeciales').modal();
    $('#modalNewOperacionProcesosEspeciales').modal();
    $('#modalEditOperacionProcesosEspeciales').modal();
    $('#lblModulo').text('Procesos Especiales - Operaciones');
    this.initFormGroupFilter();
    this.initFormGroup();
    this.GetOperacionProcesosEspeciales();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'IdSubModulo': new FormControl(13),
      'IdUsuario': new FormControl(this.json_Usuario.ID),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(),
      'Defectos': new FormControl()
    });
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  DisposeNewOperacionProcesosEspeciales() {
    $('#CLAVE_NEW_OPERACION').val('');
    $('#DESCRIPCION_NEW_OPERACION').val('');
    $('#modalNewOperacionConfeccion').val('');
    $('#lblModulo').text('Procesos Especiales - Operaciones');
    // this.GetPosicionDefectosActivos();
  }

  GetOperacionProcesosEspeciales() {
    this._procesosService.listOperaciones(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (res: any) => {
          if (res.Message.IsSuccessStatusCode) {
            console.log(res);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.operaciones = res.Vst_ProcesosEspeciales;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexion a la base de datos', '');
        }
      );
  }

  EditOperacionProcesosEspeciales() {
    const payload = this.form.value;
    payload.Defectos = this.selection.selected;
    this._procesosService.updateOperación(payload, this.idOperacion)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Operación actualizada con exito', '');
            $('#modalEditOperacionProcesosEspeciales').modal('close');
            this.GetOperacionProcesosEspeciales();
          } else {
            this._toast.warning('Algo no ha salido bien', '');
          }
        },
        error => {
          console.log(error);
          this._toast.error('Error al conectar a la base de datos', '');
        }
      );
  }

  NewOperacionProcesosEspeciales() {
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de operación para procesos especiales', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción de la operación para procesos especailes', '');
    } else {
      this._procesosService.validaOperacionExiste(this.form.controls['Clave'].value, this.form.controls['Nombre'].value)
        .pipe(
          switchMap((res: any) => {
            if (res.Message.IsSuccessStatusCode) {
              this.form.controls['Defectos'].patchValue(this.selection.selected);
              return this._procesosService.createOperacion(this.form.value);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Operación guardada con exito', '');
              $('#modalNewOperacionProcesosEspeciales').modal('close');
              this.GetOperacionProcesosEspeciales();
            } else {
              this._toast.warning('Algo no ha salido bien', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
      // let Result = false;
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
      //     url: Globals.UriRioSulApi + 'ProcesosEspeciales/NuevoOperacionProcesosEspeciales',
      //     type: 'POST',
      //     contentType: 'application/json; charset=utf-8',
      //     async: false,
      //     data: JSON.stringify({
      //       IdSubModulo: 9,
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
      // } else {
      //   this._toast.warning('La clave de operación ya se encuentra registrada en el sistema', '');
      // }
    }
  }

  getDetalle(id) {
    this.idOperacion = id;
    this._procesosService.listDefectos('', '', 'True')
      .pipe(
        map((res: any) => {
            res.Vst_ProcesosEspeciales.forEach(x => {
              delete x.Imagen;
            });
            return res;
          }
        ),
        tap(res => console.log('Despues de eliminar imagen: ', res))
      )
      .subscribe(
        (result: any) => {
          console.log(result);
          this.dataSourceEdit = new MatTableDataSource(result.Vst_ProcesosEspeciales);
          this.selection = new SelectionModel(true, []);
          this._procesosService.getOperacion(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_ProcesosEsp);
                const defectos = res.Defectos;
                const copyDataSourceEdit = [];
                this.dataSourceEdit.data.forEach((x, i) => {
                  defectos.forEach(y => {
                    if (y.Clave === x.Clave) {
                      copyDataSourceEdit.push(x);
                    }
                  });
                });
                console.log('Seleccion: ', copyDataSourceEdit);
                this.selection = new SelectionModel(true, copyDataSourceEdit);
              }
            );
        }
      );
  }

  eliminar(operacion) {
    const options = {
      text: '¿Estas seguro de eliminar esta operación?',
      buttons: {
        cancel: {
          text: 'Cancelar',
          closeModal: true,
          value: false,
          visible: true
        },
        confirm: {
          text: 'Aceptar',
          value: true,
        }
      }
    };
    swal(options).then((willDelete) => {
      if (willDelete) {
        this._procesosService.deleteDefecto(operacion.ID, 'Operacion')
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Operación eliminada con exito', '');
                this.GetOperacionProcesosEspeciales();
              } else {
                const mensaje = res.Hecho.split(',');
                this._toast.warning(mensaje[0], mensaje[2]);
              }
            },
            error => {
              console.log(error);
              this._toast.error('Error al conectar a la base de datos', '');
            }
          );
      }
    });
  }

  GetEnabledOperacionProcesosEspeciales(id) {
    const options = {
      text: '¿Estas seguro de modificar esta operación?',
      buttons: {
        cancel: {
          text: 'Cancelar',
          closeModal: true,
          value: false,
          visible: true
        },
        confirm: {
          text: 'Aceptar',
          value: true,
        }
      }
    };
    swal(options)
      .then((willDelete) => {
        if (willDelete) {
          this._procesosService.inactivaActivaOperacion(id)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Operación actualizada con exito', '');
                this.GetOperacionProcesosEspeciales();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
  }

  getDefectosActivos() {
    this.initFormGroup();
    this.selection = new SelectionModel(true, []);
    this._procesosService.listDefectos('', '', 'True')
      .pipe(
        map((res: any) => {
            res.Vst_ProcesosEspeciales.forEach(x => {
              delete x.Imagen;
            });
            return res;
          }
        ),
        tap(res => console.log('Despues de eliminar imagen: ', res))
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res.Vst_ProcesosEspeciales);
        }
      );
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
