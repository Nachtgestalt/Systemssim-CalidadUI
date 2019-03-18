import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-tipotendido',
  templateUrl: './tipotendido.component.html',
  styleUrls: ['./tipotendido.component.css']
})
export class TipotendidoComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewTipoTendido').modal();
    $('#modalEditTipoTendido').modal();
    $('#modalEnableTipoTendido').modal();
    $('#lblModulo').text('Tendido - Tipo Tendido');
    this.GetTipoTendido();
  }

  GetTipoTendido() {
    let sOptions = '';
    let _request = '';
    if ($('#CLAVE_CORTADOR').val() !== '' && $('#NOMBRE_CORTADOR').val() === '') {
      _request += '?Clave=' +  $('#CLAVE_CORTADOR').val();
    } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_CORTADOR').val() === '') {
      _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val();
    } else {
      _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val() + '?Clave=' +  $('#CLAVE_CORTADOR').val();
    }
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneTipoTendido' + _request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Cortadores[i].ID + '); DisposeEditTipoTendido(); GetInfoTipoTendido();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditTipoTendido" data-position="bottom" data-tooltip="Edita el tipo tendido seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Vst_Cortadores[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_Cortadores[i].Nombre + '</td>';
            if (json.Vst_Cortadores[i].Activo) {
              sOptions += '<td style="text-align: center">SI</td>';
            } else {
              sOptions += '<td style="text-align: center">NO</td>';
            }
            if (json.Vst_Cortadores[i].Activo === true) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableTipoTendido" data-tooltiped="Activa / Inactiva el tipo tendido seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableTipoTendido" data-tooltiped="Activa / Inactiva el tipo tendido seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbTipoTendido').html('');
          $('#tlbTipoTendido').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbTipoTendido').append('<thead><th></th><th>No.</th><th>Clave Tipo Tendido</th><th>Nombre Tipo Tendido</th><th>Estatus</th><th></th></thead>');
          $('#tlbTipoTendido').DataTable({
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

  NewTipoTendido() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de tendido', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de tendido', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del tendido', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaTipoTendidoSubModulo?SubModulo=3&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/NuevoTipoTendido',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 1,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_NEW_CORTADOR').val(),
            Nombre: $('#NOMBRE_NEW_CORTADOR').val(),
            Descripcion: $('#DESCRIPCION_NEW_CORTADOR').val(),
            Observaciones: $('#OBSERVACIONES_NEW_CORTADOR').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el tendido';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewTipoTendido').modal('close');
        }
      } else {
        this._toast.warning('La clave de tipo tendido ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditTipoTendido() {
    if ($('#CVE_EDT_TIPO_TENDIDO').val() === '') {
      this._toast.warning('Se debe ingresar una clave de tipo tendido', '');
    } else if ($('#NOMBRE_EDT_TIPO_TENDIDO').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de tipo tendido', '');
    } else if ($('#OBSERVACIONES_EDT_TIPO_TENDIDO').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del tipo tendido', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaTendidoSubModulo?SubModulo=1&Clave=' + $('#CVE_EDT_TIPO_TENDIDO').val() + '&Nombre=' + $('#NOMBRE_EDT_TIPO_TENDIDO').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/ActualizaTendido',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_TIPO_TENDIDO').val(),
            Nombre: $('#NOMBRE_EDT_TIPO_TENDIDO').val(),
            Descripcion: $('#DESCRIPCION_EDT_TIPO_TENDIDO').val(),
            Observaciones: $('#OBSERVACIONES_EDT_TIPO_TENDIDO').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el tipo tendido';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditTipoTendido').modal('close');
        }
      } else {
        this._toast.warning('La clave de tendido ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewTipoTendido() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
  }

  GetEnabledTipoTendido() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaTipoTendido?IdTipoTendido=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableTipoTendido').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetTipoTendido();
  }

}
