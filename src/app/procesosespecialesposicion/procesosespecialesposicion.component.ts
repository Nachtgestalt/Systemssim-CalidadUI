import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
declare var M: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, FormGroup} from '@angular/forms';
import {ProcesosEspecialesService} from '../services/procesos-especiales/procesos-especiales.service';
import swal from 'sweetalert';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-procesosespecialesposicion',
  templateUrl: './procesosespecialesposicion.component.html',
  styleUrls: ['./procesosespecialesposicion.component.css']
})
export class ProcesosespecialesposicionComponent implements OnInit, OnDestroy, AfterViewInit {
  dtOptions = {
    language: {
      // pageLength: 6,
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
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  posiciones = [];
  idPosicion;
  formFilter: FormGroup;
  form: FormGroup;

  constructor(
    private _procesosService: ProcesosEspecialesService,
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewPosicionProcesosEspeciales').modal();
    $('#modalEditPosicionProcesos').modal();
    $('#lblModulo').text('Procesos Especiales - Posición');
    this.initFormGroupFilter();
    this.initFormGroup();
    this.GetPosicionProcesosEspeciales();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  initFormGroup() {
    this.form = new FormGroup({
      'ID': new FormControl(),
      'IdSubModulo': new FormControl(),
      'IdUsuario': new FormControl(),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(''),
      'Operacion': new FormControl()
    });
  }

  GetPosicionProcesosEspeciales() {
    this._procesosService.listPosiciones(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (res: any) => {
          if (res.Message.IsSuccessStatusCode) {
            console.log(res);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.posiciones = res.Vst_ProcesosEspeciales;
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
    // let sOptions = '';
    // let _request = '';
    // // if ($('#CLAVE_CORTADOR').val() !== '' && $('#NOMBRE_CORTADOR').val() === '') {
    // //   _request += '?Clave=' +  $('#CLAVE_CORTADOR').val();
    // // } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_CORTADOR').val() === '') {
    // //   _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val();
    // // } else {
    // //   _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val() + '?Clave=' +  $('#CLAVE_CORTADOR').val();
    // // }
    // $.ajax({
    //   url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtienePosicion' + _request,
    //   dataType: 'json',
    //   contents: 'application/json; charset=utf-8',
    //   method: 'get',
    //   async: false,
    //   success: function (json) {
    //     if (json.Message.IsSuccessStatusCode) {
    //       let index = 1;
    //       for (let i = 0; i < json.Vst_ProcesosEspeciales.length; i++) {
    //         sOptions += '<tr>';
    //         // tslint:disable-next-line:max-line-length
    //         sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_ProcesosEspeciales[i].ID + '); DisposeEditPosicionCortador(); GetInfoPosicion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditPosicionCortador" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
    //         sOptions += '<td>' + index + '</td>';
    //         sOptions += '<td>' + json.Vst_ProcesosEspeciales[i].Clave + '</td>';
    //         sOptions += '<td>' + json.Vst_ProcesosEspeciales[i].Nombre + '</td>';
    //         if (json.Vst_ProcesosEspeciales[i].Activo) {
    //           sOptions += '<td style="text-align: center">SI</td>';
    //         } else {
    //           sOptions += '<td style="text-align: center">NO</td>';
    //         }
    //         if (json.Vst_ProcesosEspeciales[i].Activo === true) {
    //           // tslint:disable-next-line:max-line-length
    //           sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_ProcesosEspeciales[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnablePosicionProcesosEspeciales" data-tooltiped="Activa / Inactiva la posición del cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
    //         } else {
    //           // tslint:disable-next-line:max-line-length
    //           sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_ProcesosEspeciales[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnablePosicionProcesosEspeciales" data-tooltiped="Activa / Inactiva la posición del cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
    //         }
    //         sOptions += '</tr>';
    //         index ++;
    //       }
    //       $('#tlbPosicionProcesosEspeciales').html('');
    //       $('#tlbPosicionProcesosEspeciales').html('<tbody>' + sOptions + '</tbody>');
    //       // tslint:disable-next-line:max-line-length
    //       $('#tlbPosicionProcesosEspeciales').append('<thead><th></th><th>No.</th><th>Clave Posición</th><th>Nombre Posición</th><th>Estatus</th><th></th></thead>');
    //       $('#tlbPosicionProcesosEspeciales').DataTable({
    //         sorting: true,
    //         bDestroy: true,
    //         ordering: true,
    //         bPaginate: true,
    //         pageLength: 6,
    //         bInfo: true,
    //         dom: 'Bfrtip',
    //         processing: true,
    //         buttons: [
    //           'copyHtml5',
    //           'excelHtml5',
    //           'csvHtml5',
    //           'pdfHtml5'
    //          ]
    //       });
    //       $('.tooltipped').tooltip();
    //     }
    //   },
    //   error: function () {
    //     console.log('No se pudo establecer coneción a la base de datos');
    //   }
    // });
  }

  GetEnabledPosicionProcesosEspeciales(id) {
    const options = {
      text: '¿Estas seguro de modificar esta posición?',
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
          this._procesosService.inactivaActivaPosicion(id)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Operación actualizada con exito', '');
                this.GetPosicionProcesosEspeciales();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
  }

  getOperacionesActivas() {
    this.initFormGroup();
    this.selection = new SelectionModel(true, []);
    this._procesosService.listOperaciones('', '', 'True')
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

  NewPosicionProcesosEspeciales() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de procesos especiales', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de procesos especiales', '');
    // } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
    //   this._toast.warning('Se debe ingresar las observaciones de posición de procesos especiales', '');
    } else {
      const json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
      this.form.controls['IdUsuario'].patchValue(json_Usuario.ID);
      console.log('SELECCIONADOS: ', this.selection.selected);
      this.form.controls['Operacion'].patchValue(this.selection.selected);
      this._procesosService.createPosicion(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Posición guardada con exito', '');
              $('#modalNewPosicionProcesosEspeciales').modal('close');
              this.GetPosicionProcesosEspeciales();
            } else {
              this._toast.warning('Algo no ha salido bien', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          });
      // let Result = false;
      // $.ajax({
      //   // tslint:disable-next-line:max-line-length
      //   url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaPosicionProcesosEspecialesSubModulo?SubModulo=14&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
      //     url: Globals.UriRioSulApi + 'ProcesosEspeciales/NuevoPosicion',
      //     type: 'POST',
      //     contentType: 'application/json; charset=utf-8',
      //     async: false,
      //     data: JSON.stringify({
      //       IdSubModulo: 1,
      //       IdUsuario: Json_Usuario.ID,
      //       Clave: $('#CVE_NEW_CORTADOR').val(),
      //       Nombre: $('#NOMBRE_NEW_CORTADOR').val(),
      //       Descripcion: $('#DESCRIPCION_NEW_CORTADOR').val(),
      //       Observaciones: $('#OBSERVACIONES_NEW_CORTADOR').val(),
      //       Posicion: $('#HDN_ARR').val()
      //     }),
      //     success: function (json) {
      //       if (json.Message.IsSuccessStatusCode) {
      //         Mensaje = 'Se agrego correctamente la posición de los procesos especiales';
      //       }
      //     },
      //     error: function () {
      //       console.log('No se pudo establecer conexión a la base de datos');
      //     }
      //   });
      //   if (Mensaje !== '') {
      //     this._toast.success(Mensaje, '');
      //     $('#modalNewPosicionProcesosEspeciales').modal('close');
      //   }
      // } else {
      //   this._toast.warning('La clave de defecto procesos especiales ya se encuentra registrada en el sistema', '');
      // }
    }
  }

  DisposeNewPosicionProcesosEspeciales() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    this.GetPosicionDefectosActivos();
  }

  getDetalle(id) {
    this.idPosicion = id;
    this._procesosService.listOperaciones('', '', 'True')
      .subscribe(
        (result: any) => {
          console.log(result);
          this.dataSourceEdit = new MatTableDataSource(result.Vst_ProcesosEspeciales);
          this.selection = new SelectionModel(true, []);
          this._procesosService.getPosicion(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_ProcesosEsp);
                setTimeout(() => M.updateTextFields(), 100);
                const defectos = res.Operaciones;
                const copyDataSourceEdit = [];
                this.dataSourceEdit.data.forEach((x, i) => {
                  defectos.forEach(y => {
                    console.log('Operaciones:', x);
                    console.log('Y:', y);
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


  GetPosicionDefectosActivos() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtieneDefectosActivos',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let Index = 1;
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td style="text-align:center"><label><input id="chk_' + json.Vst_Cortadores[i].ID + '" type="checkbox" class="filled-in" /><span></span></label></td>';
            sOptions += '<td>' + Index + '</td>';
            sOptions += '<td>' + json.Vst_Cortadores[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_Cortadores[i].Nombre + '</td>';
            sOptions += '</tr>';

            Index++;
          }
          $('#tlbPosicionDefecto').html('');
          $('#tlbPosicionDefecto').html('<tbody id="tdby_Posicion">' + sOptions + '</tbody>');
          $('#tlbPosicionDefecto').append('<thead><th></th><th>No.</th><th>Clave Defecto</th><th>Nombre Defecto</th></thead>');
          $('#tlbPosicionDefecto').DataTable({
            sorting: true,
            bDestroy: true,
            ordering: true,
            bPaginate: true,
            pageLength: 6,
            bInfo: true,
            dom: 'Bfrtip',
            processing: true,
            buttons: [
              'copyHtml5',
              'excelHtml5',
              'csvHtml5',
              'pdfHtml5'
             ]
          });
          $('.tooltipped').tooltip();
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  eliminar(posicion) {
    const options = {
      text: '¿Estas seguro de eliminar esta posición?',
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
        this._procesosService.deleteDefecto(posicion.ID, 'Posicion')
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Posición eliminada con exito', '');
                this.GetPosicionProcesosEspeciales();
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

  editPosicion() {
    const payload = this.form.value;
    payload.Operacion = this.selection.selected;
    this._procesosService.updatePosicion(payload, this.idPosicion)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Posición actualizada con exito', '');
            $('#modalEditPosicionProcesos').modal('close');
            this.GetPosicionProcesosEspeciales();
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
