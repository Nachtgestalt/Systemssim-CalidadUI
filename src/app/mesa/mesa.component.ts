import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})
export class MesaComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewMesa').modal();
    $('#modalEditMesa').modal();
    $('#modalEnableMesa').modal();
    $('#lblModulo').text('Corte - # Mesa');
    this.GetMesa();
  }

  GetMesa() {
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
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneMesa' + _request,
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
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Cortadores[i].ID + '); DisposeEditMesa(); GetInfoMesa();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditMesa" data-position="bottom" data-tooltip="Edita la mesa seleccionada"><i class="material-icons right">edit</i></a></td>';
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
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableMesa" data-tooltiped="Activa / Inactiva la mesa seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableMesa" data-tooltiped="Activa / Inactiva la mesa seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbMesa').html('');
          $('#tlbMesa').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbMesa').append('<thead><th></th><th>No.</th><th>Clave Mesa</th><th>Nombre Mesa</th><th>Estatus</th><th></th></thead>');
          $('#tlbMesa').DataTable({
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

  GetEnabledMesa() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaMesa?IdMesa=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableMesa').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetMesa();
  }

  NewMesa() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de mesa', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de mesa', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del mesa', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaMesaSubModulo?SubModulo=2&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/NuevoMesa',
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
              Mensaje = 'Se agrego correctamente el corte de mesa';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewMesa').modal('close');
        }
      } else {
        this._toast.warning('La clave de mesa ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditMesa() {
    if ($('#CVE_EDT_MESA').val() === '') {
      this._toast.warning('Se debe ingresar una clave de cortador de mesa', '');
    } else if ($('#NOMBRE_EDT_MESA').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de cortador de mesa', '');
    } else if ($('#OBSERVACIONES_EDT_MESA').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del cortador de mesa', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaMesaSubModulo?SubModulo=4&Clave=' + $('#CVE_EDT_MESA').val() + '&Nombre=' + $('#NOMBRE_EDT_MESA').val(),
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
          url: Globals.UriRioSulApi + 'Cortadores/ActualizaMesa',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_MESA').val(),
            Nombre: $('#NOMBRE_EDT_MESA').val(),
            Descripcion: $('#DESCRIPCION_EDT_MESA').val(),
            Observaciones: $('#OBSERVACIONES_EDT_MESA').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el corte de la mesa';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditMesa').modal('close');
        }
      } else {
        this._toast.warning('La clave de corte de mesa ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewMesa() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
  }

}
