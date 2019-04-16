import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import swal from 'sweetalert';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {CorteService} from '../services/corte/corte.service';

declare var $: any;

@Component({
  selector: 'app-defectocorte',
  templateUrl: './defectocorte.component.html',
  styleUrls: ['./defectocorte.component.css']
})
export class DefectocorteComponent implements OnInit, OnDestroy, AfterViewInit {
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

  defectos = [];
  dtTrigger: Subject<any> = new Subject();

  form: FormGroup;
  formFilter: FormGroup;
  constructor(
    private _cortadoresService: CorteService,
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoCortador').modal();
    $('#modalEditDefectoCortador').modal();
    $('#modalEnableDefectoCortador').modal();
    $('#lblModulo').text('Corte - Defectos');
    this.obtenerDefectos();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  obtenerDefectos() {
    this._cortadoresService.listDefectos(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (defectos: any) => {
          console.log(defectos);
          if (defectos.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = defectos.Vst_Cortadores;
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


    // let sOptions = '';
    // let _request = '';
    // if ($('#CLAVE_CORTADOR').val() !== '' && $('#NOMBRE_CORTADOR').val() === '') {
    //   _request += '?Clave=' +  $('#CLAVE_CORTADOR').val();
    // } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_CORTADOR').val() === '') {
    //   _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val();
    // } else {
    //   _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val() + '?Clave=' +  $('#CLAVE_CORTADOR').val();
    // }
    // $.ajax({
    //   url: Globals.UriRioSulApi + 'Cortadores/ObtieneDefecto' + _request,
    //   dataType: 'json',
    //   contents: 'application/json; charset=utf-8',
    //   method: 'get',
    //   async: false,
    //   success: function (json) {
    //     if (json.Message.IsSuccessStatusCode) {
    //       let index = 1;
    //       for (let i = 0; i < json.Vst_Cortadores.length; i++) {
    //         sOptions += '<tr>';
    //         // tslint:disable-next-line:max-line-length
    //         sOptions += '<td><a onclick="SetId(' + json.Vst_Cortadores[i].ID + '); DisposeEditDefectoCortador(); GetInfoDefecto();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditDefectoCortador" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
    //         sOptions += '<td>' + index + '</td>';
    //         sOptions += '<td>' + json.Vst_Cortadores[i].Clave + '</td>';
    //         sOptions += '<td>' + json.Vst_Cortadores[i].Nombre + '</td>';
    //         if (json.Vst_Cortadores[i].Activo) {
    //           sOptions += '<td style="text-align: center">SI</td>';
    //         } else {
    //           sOptions += '<td style="text-align: center">NO</td>';
    //         }
    //         if (json.Vst_Cortadores[i].Activo === true) {
    //           // tslint:disable-next-line:max-line-length
    //           sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoCortador" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
    //         } else {
    //           // tslint:disable-next-line:max-line-length
    //           sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoCortador" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
    //         }
    //         sOptions += '</tr>';
    //         index ++;
    //       }
    //       $('#tlbDefectoCortadores').html('');
    //       $('#tlbDefectoCortadores').html('<tbody>' + sOptions + '</tbody>');
    //       // tslint:disable-next-line:max-line-length
    //       $('#tlbDefectoCortadores').append('<thead><th></th><th>No.</th><th>Clave Defecto</th><th>Nombre Defecto</th><th>Estatus</th><th></th></thead>');
    //       $('#tlbDefectoCortadores').DataTable({
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

  getDetalle(defecto) {

  }

  GetEnabledDefectoCortador(defecto) {
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaDefecto?IdDefecto=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableDefectoCortador').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.obtenerDefectos();
  }

  NewDefectoCortador() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del defecto cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaDefectoSubModulo?SubModulo=6&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/NuevoDefecto',
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
            Imagen:  ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewDefectoCortador').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditDefectoCortador() {
    if ($('#CVE_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto cortador', '');
    } else if ($('#NOMBRE_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto cortador', '');
    } else if ($('#OBSERVACIONES_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaDefectoSubModulo?SubModulo=6&Clave=' + $('#CVE_EDT_DEFECTO').val() + '&Nombre=' + $('#NOMBRE_EDT_DEFECTO').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/ActualizaDefecto',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_DEFECTO').val(),
            Nombre: $('#NOMBRE_EDT_DEFECTO').val(),
            Descripcion: $('#DESCRIPCION_EDT_DEFECTO').val(),
            Observaciones: $('#OBSERVACIONES_EDT_DEFECTO').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditDefectoCortador').modal('close');
        }
      } else {
        this._toast.warning('La clave defecto cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  eliminar(defecto) {
    console.log('eliminar: ', defecto);
    swal({
      text: '¿Estas seguro de eliminar este defecto?',
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
    })
      .then((willDelete) => {
        if (willDelete) {
          // this._terminadoService.deleteDefecto(defecto.ID)
          //   .subscribe(
          //     (res: any) => {
          //       console.log(res);
          //       if (res.Message.IsSuccessStatusCode) {
          //         this._toast.success('Defecto eliminado con exito', '');
          //         this.getDefectosTerminado();
          //       } else {
          //         const mensaje = res.Hecho.split(',');
          //         this._toast.warning(mensaje[0], mensaje[2]);
          //       }
          //     },
          //     error => {
          //       console.log(error);
          //       this._toast.error('Error al conectar a la base de datos', '');
          //     }
          //   );
        }
      });
  }

  DisposeNewDefectoCortador() {
    $('#CVE_NEW_CORTADOR').val('');
    $('#NOMBRE_NEW_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

}
