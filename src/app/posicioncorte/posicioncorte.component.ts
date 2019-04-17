import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {CorteService} from '../services/corte/corte.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import swal from 'sweetalert';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-posicioncorte',
  templateUrl: './posicioncorte.component.html',
  styleUrls: ['./posicioncorte.component.css']
})
export class PosicioncorteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  private json_usuario = JSON.parse(sessionStorage.getItem('currentUser'));
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
  dtTrigger: Subject<any> = new Subject();

  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  posiciones = [];
  idOperacion;
  form: FormGroup;
  formFilter: FormGroup;
  constructor(
    private _cortadoresService: CorteService,
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewPosicionCortador').modal();
    $('#modalEditPosicionCortador').modal();
    $('#modalEnablePosicionCortador').modal();
    $('#lblModulo').text('Corte - Posición');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerPosiciones();
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
      'ID': new FormControl(),
      'IdSubModulo': new FormControl(1),
      'IdUsuario': new FormControl(this.json_usuario.ID),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Defecto': new FormControl(),
    });
  }

  initFormFilterGroup() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  obtenerPosiciones() {
    this._cortadoresService.listPosiciones(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (defectos: any) => {
          console.log(defectos);
          if (defectos.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.posiciones = defectos.Vst_Cortadores;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getDetalle(posicion) {
    this.idOperacion = posicion.ID;
    this._cortadoresService.listDefectos('', '', 'True')
      .subscribe(
        (result: any) => {
          console.log(result);
          this.dataSourceEdit = new MatTableDataSource(result.Vst_Cortadores);
          this.selection = new SelectionModel(true, []);
          this._cortadoresService.getPosicion(posicion.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_Cortador);
                setTimeout(() => M.updateTextFields(), 100);
                const defectos = res.Vst_Posicion;
                const copyDataSourceEdit = [];
                this.dataSourceEdit.data.forEach((x) => {
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

  GetEnabledPosicionCortador(posicion) {
    const options = {
      text: '¿Estas seguro de modificar este cortador?',
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
            this._cortadoresService.inactivaActivaPosicion(posicion.ID)
              .subscribe(
                (res: any) => {
                  // console.log(res);
                  if (res.Message.IsSuccessStatusCode) {
                    this._toast.success('Posición actualizada con exito', '');
                    this.obtenerPosiciones();
                  }
                },
                error => {
                  console.log(error);
                  this._toast.error('No se pudo establecer conexión a la base de datos', '');
                }
              );
          }
        }
      );
    // $.ajax({
    //   url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaPosicion?IdPosicion=' + $('#HDN_ID').val(),
    //   dataType: 'json',
    //   contents: 'application/json; charset=utf-8',
    //   method: 'get',
    //   async: false,
    //   success: function (json) {
    //     if (json.Message.IsSuccessStatusCode) {
    //       $('#modalEnablePosicionCortador').modal('close');
    //     }
    //   },
    //   error: function () {
    //     console.log('No se pudo establecer coneción a la base de datos');
    //   }
    // });
    // this.obtenerPosiciones();
  }

  openModalAgregar() {
    this.initFormGroup();
    this.getDefectosActivos();
  }

  NewPosicionCortador() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición del cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición del cortador', '');
    } else {
      const defectos = this.selection.selected;
      defectos.forEach(
        (x: any) => {
          x.IdCortador = x.ID;
        }
      );
      this.form.controls['Defecto'].patchValue(defectos);
      this._cortadoresService.createPosicion(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Posición guardada con exito', '');
              $('#modalNewPosicionCortador').modal('close');
              this.obtenerPosiciones();
              this.initFormGroup();
            } else {
              this._toast.warning('Algo no ha salido bien', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          });
    }
  }

  getDefectosActivos() {
    this.selection = new SelectionModel(true, []);
    this._cortadoresService.listDefectos('', '', 'True')
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res.Vst_Cortadores);
        }
      );
  }

  EditPosicionCortador() {
    if ($('#CVE_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de cortador', '');
    } else if ($('#NOMBRE_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de cortador', '');
    } else {
      const payload = this.form.value;
      payload.Defecto = this.selection.selected;
      payload.Defecto.forEach(
        (x: any) => {
          x.IdCortador = x.ID;
        }
      );
      this._cortadoresService.updatePosicion(payload)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se actualizo correctamente la posición', '');
              $('#modalEditPosicionCortador').modal('close');
              this.obtenerPosiciones();
            } else {
              this._toast.warning('Algo salio mal', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    }
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
        this._cortadoresService.deletePosicion(posicion.ID)
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Posición eliminada con exito', '');
                this.obtenerPosiciones();
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
