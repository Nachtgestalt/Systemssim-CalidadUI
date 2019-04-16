import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-corte',
  templateUrl: './corte.component.html',
  styleUrls: ['./corte.component.css']
})
export class CorteComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewCortador').modal();
    $('#modalEditDeCortador').modal();
    $('#modalEnableCortador').modal();
    $('#lblModulo').text('Corte - Cortadores');
    this.GetCortadores();
  }

  GetCortadores() {
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
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneCortadores' + _request,
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
            sOptions += '<td><a onclick="SetId(' + json.Vst_Cortadores[i].ID + '); DisposeEditCortadores(); GetInfoCortador();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditCortador" data-position="bottom" data-tooltip="Edita el cortador seleccionado"><i class="material-icons right">edit</i></a></td>';
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
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableCortador" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableCortador" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbCortadores').html('');
          $('#tlbCortadores').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbCortadores').append('<thead><th></th><th>No.</th><th>Clave Cortador</th><th>Nombre Cortador</th><th>Estatus</th><th></th></thead>');
          $('#tlbCortadores').DataTable({
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

  GetEnabledCortador() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaCortador?Idcortador=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableCortador').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetCortadores();
  }

  NewCortador() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de cortador', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaCortadorSubModulo?SubModulo=1&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/NuevoCortador',
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
              Mensaje = 'Se agrego correctamente el cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewCortador').modal('close');
        }
      } else {
        this._toast.warning('La clave de cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditCortador() {
    if ($('#CVE_EDT_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de cortador', '');
    } else if ($('#NOMBRE_EDT_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de cortador', '');
    } else if ($('#OBSERVACIONES_EDT_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaCortadorSubModulo?SubModulo=1&Clave=' + $('#CVE_EDT_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_EDT_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/ActualizaCortador',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_CORTADOR').val(),
            Nombre: $('#NOMBRE_EDT_CORTADOR').val(),
            Descripcion: $('#DESCRIPCION_EDT_CORTADOR').val(),
            Observaciones: $('#OBSERVACIONES_EDT_CORTADOR').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el cortador';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditCortador').modal('close');
        }
      } else {
        this._toast.warning('La clave de cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewCortador() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
  }

}
