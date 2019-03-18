import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-posicioncorte',
  templateUrl: './posicioncorte.component.html',
  styleUrls: ['./posicioncorte.component.css']
})
export class PosicioncorteComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewPosicionCortador').modal();
    $('#modalEditPosicionCortador').modal();
    $('#modalEnablePosicionCortador').modal();
    $('#lblModulo').text('Corte - Posición');
    this.GetPosicionCortador();
  }

  GetPosicionCortador() {
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
      url: Globals.UriRioSulApi + 'Cortadores/ObtienePosicion' + _request,
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
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Cortadores[i].ID + '); DisposeEditPosicionCortador(); GetInfoPosicion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditPosicionCortador" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
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
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnablePosicionCortador" data-tooltiped="Activa / Inactiva la posición del cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Cortadores[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnablePosicionCortador" data-tooltiped="Activa / Inactiva la posición del cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbPosicionCortador').html('');
          $('#tlbPosicionCortador').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbPosicionCortador').append('<thead><th></th><th>No.</th><th>Clave Posición</th><th>Nombre Posición</th><th>Estatus</th><th></th></thead>');
          $('#tlbPosicionCortador').DataTable({
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

  GetEnabledPosicionCortador() {
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
    this.GetPosicionCortador();
  }

  NewPosicionCortador() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición del cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición del cortador', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones de posición del cortador', '');
    } else {
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

  GetPosicionDefectosActivos() {
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

  DisposeNewPosicionCortador() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    this.GetPosicionDefectosActivos();
  }

}
