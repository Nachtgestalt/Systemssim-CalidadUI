import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ConfeccionService} from '../services/confeccion/confeccion.service';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import swal from 'sweetalert';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-operacionconfeccion',
  templateUrl: './operacionconfeccion.component.html',
  styleUrls: ['./operacionconfeccion.component.css']
})
export class OperacionconfeccionComponent implements OnInit, OnDestroy, AfterViewInit {
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

  operaciones = [];
  idOperacion;
  form: FormGroup;
  formFilter: FormGroup;
  constructor(
    private _confeccionService: ConfeccionService,
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewOperacionConfeccion').modal();
    $('#modalEditOperacionConfeccion').modal();
    $('#lblModulo').text('Confección - Operación');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerOperaciones();
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
      'Defectos': new FormControl(),
    });
  }

  initFormFilterGroup() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  obtenerOperaciones() {
    this._confeccionService.listOperaciones(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (operaciones: any) => {
          console.log(operaciones);
          if (operaciones.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.operaciones = operaciones.Vst_Confeccion;
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

  getDefectosActivos() {
    this.selection = new SelectionModel(true, []);
    this._confeccionService.listDefectos('', '', 'True')
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res.Vst_Confeccion);
        }
      );
  }

  GetEnabledOperacion(operacion) {
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
            this._confeccionService.inactivaActivaOperacion(operacion.ID)
              .subscribe(
                (res: any) => {
                  // console.log(res);
                  if (res.Message.IsSuccessStatusCode) {
                    this._toast.success('Operación actualizada con exito', '');
                    this.obtenerOperaciones();
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
  }

  openModalAgregar() {
    this.initFormGroup();
    this.getDefectosActivos();
  }

  NewOperacionConfeccion() {
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de la operación', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción de la operación', '');
    } else {
      const defectos = this.selection.selected;
      defectos.forEach(
        (x: any) => {
          x.IdDefecto = x.ID;
        }
      );
      this.form.controls['Defectos'].patchValue(defectos);
      this._confeccionService.createOperacion(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Posición guardada con exito', '');
              $('#modalNewOperacionConfeccion').modal('close');
              this.obtenerOperaciones();
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

  getDetalle(operacion) {
    this.idOperacion = operacion.ID;
    this._confeccionService.listDefectos('', '', 'True')
      .subscribe(
        (result: any) => {
          console.log(result);
          this.dataSourceEdit = new MatTableDataSource(result.Vst_Confeccion);
          this.selection = new SelectionModel(true, []);
          this._confeccionService.getOperacion(operacion.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_Confeccion);
                setTimeout(() => M.updateTextFields(), 100);
                const defectos = res.Vst_Oper_Conf;
                const copyDataSourceEdit = [];
                this.dataSourceEdit.data.forEach((x) => {
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

  EditOperacionConfeccion() {
    if ($('#CVE_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de cortador', '');
    } else if ($('#NOMBRE_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de cortador', '');
    } else {
      const payload = this.form.value;
      payload.Defectos = this.selection.selected;
      payload.Defectos.forEach(
        (x: any) => {
          x.IdDefecto = x.ID;
        }
      );
      this._confeccionService.updateOperacion(payload)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se actualizo correctamente la operación', '');
              $('#modalEditOperacionConfeccion').modal('close');
              this.obtenerOperaciones();
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

  eliminar(operacion) {
    // TODO: En cuanto el back termine, conectar este metodo
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
