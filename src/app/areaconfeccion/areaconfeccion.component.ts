import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ConfeccionService} from '../services/confeccion/confeccion.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import swal from 'sweetalert';

declare var M: any;
declare var $: any;

@Component({
  selector: 'app-areaconfeccion',
  templateUrl: './areaconfeccion.component.html',
  styleUrls: ['./areaconfeccion.component.css']
})
export class AreaconfeccionComponent implements OnInit, OnDestroy, AfterViewInit {
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

  displayedColumns: string[] = ['select', 'posicion', 'clave', 'nombre'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  areas = [];
  idArea;
  dtTrigger: Subject<any> = new Subject();
  form: FormGroup;
  formFilter: FormGroup;

  constructor(
    private _confeccionService: ConfeccionService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalEnableAreaConfeccion').modal();
    $('#modalNewAreaConfeccion').modal();
    $('#modalEditAreaConfeccion').modal();
    $('#lblModulo').text('Confección - Área');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerAreas();
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
      'Operaciones': new FormControl(),
    });
  }

  initFormFilterGroup() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  openModalAgregar() {
    this.initFormGroup();
    this.getOperacionesActivas();
  }

  obtenerAreas() {
    this._confeccionService.listAreas(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (areas: any) => {
          console.log(areas);
          if (areas.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.areas = areas.Vst_Confeccion;
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

  getOperacionesActivas() {
    this.selection = new SelectionModel(true, []);
    this._confeccionService.listOperaciones('', '', 'True')
      .subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = new MatTableDataSource(res.Vst_Confeccion);
        }
      );
  }

  GetEnabledArea(area) {
    const options = {
      text: '¿Estas seguro de modificar esta área?',
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
            this._confeccionService.inactivaActivaArea(area.ID)
              .subscribe(
                (res: any) => {
                  // console.log(res);
                  if (res.Message.IsSuccessStatusCode) {
                    this._toast.success('Área actualizada con exito', '');
                    this.obtenerAreas();
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

  NewAreaConfeccion() {
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición del área', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción del área', '');
    } else {
      const operaciones = this.selection.selected;
      operaciones.forEach(
        (x: any) => {
          x.IdOperacion = x.ID;
        }
      );
      this.form.controls['Operaciones'].patchValue(operaciones);
      this._confeccionService.createArea(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Área guardada con exito', '');
              $('#modalNewAreaConfeccion').modal('close');
              this.obtenerAreas();
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

  getDetalle(area) {
    this.idArea = area.ID;
    this._confeccionService.listOperaciones('', '', 'True')
      .subscribe(
        (result: any) => {
          console.log(result);
          this.dataSourceEdit = new MatTableDataSource(result.Vst_Confeccion);
          this.selection = new SelectionModel(true, []);
          this._confeccionService.getArea(area.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_Confeccion);
                setTimeout(() => M.updateTextFields(), 100);
                const operaciones = res.Vst_Oper_Conf;
                const copyDataSourceEdit = [];
                this.dataSourceEdit.data.forEach((x) => {
                  operaciones.forEach(y => {
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

  EditAreaConfeccion() {
    if ($('#CVE_EDT_AREA').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de cortador', '');
    } else if ($('#NOMBRE_EDT_AREA').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de cortador', '');
    } else {
      const payload = this.form.value;
      payload.Operaciones = this.selection.selected;
      payload.Operaciones.forEach(
        (x: any) => {
          x.IdOperacion = x.ID;
        }
      );
      this._confeccionService.updateArea(payload)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se actualizo correctamente el área', '');
              $('#modalEditAreaConfeccion').modal('close');
              this.obtenerAreas();
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

  eliminar(area) {
    // TODO: En cuanto el back termine conectar este metodo
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
