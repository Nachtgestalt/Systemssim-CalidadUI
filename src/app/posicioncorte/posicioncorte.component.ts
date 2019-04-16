import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {CorteService} from '../services/corte/corte.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

declare var $: any;
declare var jQuery: any;

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

  posiciones = [];

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
      'Descripcion': new FormControl('a'),
      'Observaciones': new FormControl('a'),
      'Imagen': new FormControl(),
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

  getDetalle(posicion) {}

  GetEnabledPosicionCortador(posicion) {
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaPosicion?IdPosicion=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnablePosicionCortador').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.obtenerPosiciones();
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
      // this.form
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaPosicionSubModulo?SubModulo=7&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            Result = json.Hecho;
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión a la base de datos');
        }
      });
      if (Result) {
        let Mensaje = '';
        const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
        $.ajax({
          url: Globals.UriRioSulApi + 'Cortadores/NuevoPosicion',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 1,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_NEW_CORTADOR').val(),
            Nombre: $('#NOMBRE_NEW_CORTADOR').val(),
            Descripcion: $('#DESCRIPCION_NEW_CORTADOR').val(),
            Observaciones: $('#OBSERVACIONES_NEW_CORTADOR').val(),
            Posicion: $('#HDN_ARR').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente la posición cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewPosicionCortador').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto cortador ya se encuentra registrada en el sistema', '');
      }
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
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneDefectosActivos',
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

  EditPosicionCortador() {
    if ($('#CVE_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de cortador', '');
    } else if ($('#NOMBRE_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de cortador', '');
    } else if ($('#OBSERVACIONES_EDT_POSICION').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones de la posición cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaPosicionSubModulo?SubModulo=7&Clave=' + $('#CVE_EDT_DEFECTO').val() + '&Nombre=' + $('#NOMBRE_EDT_POSICION').val(),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            Result = json.Hecho;
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión a la base de datos');
        }
      });
      if (Result) {
        let Mensaje = '';
        const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
        $.ajax({
          url: Globals.UriRioSulApi + 'Cortadores/ActualizaPosicion',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_DEFECTO').val(),
            Nombre: $('#NOMBRE_EDT_DEFECTO').val(),
            Descripcion: $('#DESCRIPCION_EDT_DEFECTO').val(),
            Observaciones: $('#OBSERVACIONES_EDT_DEFECTO').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente la posición del cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditPosicionCortador').modal('close');
        }
      } else {
        this._toast.warning('La clave defecto posición ya se encuentra registrada en el sistema', '');
      }
    }
  }

  eliminar(posicion) {}

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
