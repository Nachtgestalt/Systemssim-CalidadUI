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
import {map, switchMap, tap} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import swal from 'sweetalert';

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

  dataSourceEdit = new MatTableDataSource<any>([]);
  displayedColumnsEdit: string[] = ['select', 'posicion', 'clave', 'nombre'];

  json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  operaciones = [];

  idOperacion;

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
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
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
    this.initFormGroup();
    this.selection = new SelectionModel(true, []);
    this._lavanderiaService.listDefectos('', '', 'True')
      .pipe(
        map((res: any) => {
            res.Vst_Lavanderia.forEach(x => {
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
          this.dataSource = new MatTableDataSource(res.Vst_Lavanderia);
        }
      );
  }

  EditOperacionProcesosEspeciales() {
    console.log(this.selection.selected);
    const payload = this.form.value;
    payload.Defecto = this.selection.selected;
    this._lavanderiaService.updateOperación(payload, this.idOperacion)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Operación actualizada con exito', '');
            $('#modalEditOperacionProcesosEspeciales').modal('close');
            this.GetOperacionLavanderia();
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
    console.log(this.selection.selected);
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de operación para procesos especiales', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción de la operación para procesos especailes', '');
    } else {
      this._lavanderiaService.validaOperacionExiste(this.form.controls['Clave'].value, this.form.controls['Nombre'].value)
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
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Operación guardada con exito', '');
              $('#modalNewOperacionProcesosEspeciales').modal('close');
              this.GetOperacionLavanderia();
            } else {
              this._toast.warning('Algo no ha salido bien', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    }
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
          this._lavanderiaService.inactivaActivaOperacion(id)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Operación actualizada con exito', '');
                this.GetOperacionLavanderia();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
  }

  getDetalle(id) {
    this.idOperacion = id;
    this._lavanderiaService.listDefectos('', '', 'True')
      .pipe(
        map((res: any) => {
            res.Vst_Lavanderia.forEach(x => {
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
          this.dataSourceEdit = new MatTableDataSource(res.Vst_Lavanderia);
          this.selection = new SelectionModel(true, []);
          this._lavanderiaService.getOperacion(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                this.form.patchValue(res.Vst_Lavanderia);
                const defectos = res.Defecto;
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
        this._lavanderiaService.deleteDefecto(operacion.ID, 'Operacion')
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Operación eliminada con exito', '');
                this.GetOperacionLavanderia();
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
