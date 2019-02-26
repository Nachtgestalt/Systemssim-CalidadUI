import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-procesosespecialesposicion',
  templateUrl: './procesosespecialesposicion.component.html',
  styleUrls: ['./procesosespecialesposicion.component.css']
})
export class ProcesosespecialesposicionComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewPosicionProcesosEspeciales').modal();
    $('#modalEditPosicionProcesosEspeciales').modal();
    $('#modalEnablePosicionProcesosEspeciales').modal();
    $('#lblModulo').text('Procesos Especiales - Posición');
  }

  GetPosicionProcesosEspeciales() {
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
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtienePosicion' + _request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.Vst_ProcesosEspeciales.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_ProcesosEspeciales[i].ID + '); DisposeEditPosicionCortador(); GetInfoPosicion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditPosicionCortador" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Vst_ProcesosEspeciales[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_ProcesosEspeciales[i].Nombre + '</td>';
            if (json.Vst_ProcesosEspeciales[i].Activo) {
              sOptions += '<td style="text-align: center">SI</td>';
            } else {
              sOptions += '<td style="text-align: center">NO</td>';
            }
            if (json.Vst_Cortadores[i].Activo === true) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_ProcesosEspeciales[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnablePosicionProcesosEspeciales" data-tooltiped="Activa / Inactiva la posición del cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_ProcesosEspeciales[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnablePosicionProcesosEspeciales" data-tooltiped="Activa / Inactiva la posición del cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbPosicionProcesosEspeciales').html('');
          $('#tlbPosicionProcesosEspeciales').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbPosicionProcesosEspeciales').append('<thead><th></th><th>No.</th><th>Clave Posición</th><th>Nombre Posición</th><th>Estatus</th><th></th></thead>');
          $('#tlbPosicionProcesosEspeciales').DataTable({
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

  GetEnabledPosicionProcesosEspeciales() {
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ActivaInactivaPosicion?IdPosicion=' + $('#HDN_ID').val(),
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
    this.GetPosicionProcesosEspeciales();
  }

  NewPosicionProcesosEspeciales() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de procesos especiales', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de posición de procesos especiales', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones de posición de procesos especiales', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaPosicionProcesosEspecialesSubModulo?SubModulo=14&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'ProcesosEspeciales/NuevoPosicion',
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
              Mensaje = 'Se agrego correctamente la posición de los procesos especiales';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewPosicionProcesosEspeciales').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto procesos especiales ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewPosicionProcesosEspeciales() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    this.GetPosicionDefectosActivos();
  }

  GetPosicionDefectosActivos() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtieneDefectosActivos',
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

}
