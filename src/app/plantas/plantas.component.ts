import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ConfeccionService} from '../services/confeccion/confeccion.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.component.html',
  styleUrls: ['./plantas.component.css']
})
export class PlantasComponent implements OnInit, OnDestroy, AfterViewInit {
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

  plantas = [];

  areaID;
  form: FormGroup;

  constructor(private _confeccionService: ConfeccionService,
              private _toast: ToastrService) {
  }

  ngOnInit() {
    $('#modalRelacionArea').modal();
    $('#lblModulo').text('Confección - Plantas');
    this.initFormGroup();
    this.obtenerPlantas();
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
      'IdPlanta': new FormControl(),
      'IdSubModulo': new FormControl(1),
      'IdUsuario': new FormControl(this.json_usuario.ID),
      'Planta': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Areas': new FormControl(),
    });
  }

  obtenerPlantas() {
    this._confeccionService.listPlantas()
      .subscribe(
        (plantas: any) => {
          if (plantas.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.plantas = plantas.Vst_Plantas;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        }
      );
  }

  openModalPlantaArea(planta) {
    this.form.patchValue(planta);
    setTimeout(() => M.updateTextFields(), 100);
    this._confeccionService.listAreas('', '', 'True')
      .subscribe(
        (result: any) => {
          console.log(result);
          this.dataSource = new MatTableDataSource(result.Vst_Confeccion);
          this.selection = new SelectionModel(true, []);
          this._confeccionService.getPlanta(planta.Planta)
            .subscribe(
              (res: any) => {
                this.areaID = res.IdPlanta;
                this.form.get('IdPlanta').patchValue(res.IdPlanta);
                console.log(res);
                const areas = res.Areas;
                const copyDataSourceEdit = [];
                if (areas) {
                  this.dataSource.data.forEach((x) => {
                    areas.forEach(y => {
                      if (y.Clave === x.Clave) {
                        copyDataSourceEdit.push(x);
                      }
                    });
                  });
                }
                console.log('Seleccion: ', copyDataSourceEdit);
                this.selection = new SelectionModel(true, copyDataSourceEdit);
              }
            );
        }
      );
  }

  guardarPlantaArea() {
    const areas = this.selection.selected;
    areas.forEach(
      (x: any) => {
        x.IdArea = x.ID;
      }
    );
    this.form.controls['Areas'].patchValue(areas);
    if (this.areaID !== 0) {
      this._confeccionService.updatePlanta(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            this._toast.success('Relación actualizada con exito', '');
            $('#modalRelacionArea').modal('close');
            this.obtenerPlantas();
            this.initFormGroup();
          }
        );
    } else {
      this._confeccionService.createPlanta(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Relación guardada con exito', '');
              $('#modalRelacionArea').modal('close');
              this.obtenerPlantas();
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
