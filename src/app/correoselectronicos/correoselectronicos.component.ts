import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-correoselectronicos',
  templateUrl: './correoselectronicos.component.html',
  styleUrls: ['./correoselectronicos.component.css']
})
export class CorreoselectronicosComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewCorreo').modal();
    $('#modalEdtCorreos').modal();
    $('#modalCorreos').modal();
    $('#modalDeleteAlerta').modal();
    $('#lblModulo').text('Catálogo Correos Electrónicos');
    this.GetEmails();
  }

  GetEmails() {
    let sOptions = '';
    const request = $('#USU_BUSQUEDA_EMAIL').val() !== '' ? ('&CorreoE=' + $('#USU_BUSQUEDA_EMAIL').val()) : '';
    $.ajax({
      url: Globals.UriRioSulApi + 'CorreosElectronicos/ObtieneUsuariosCierreAuditoria?Key=' + atob(Globals.PasswordKey) + request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.CorreosA.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="SetId(' + json.CorreosA[i].UsuarioId + '); EditAlertasCierreAuditoriaUsu();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEdtCorreos" data-position="bottom" data-tooltip="Edita el usuario seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.CorreosA[i].Email + '</td>';
            if (json.CorreosA[i].Corte) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" checked="true" id="Corte" type="checkbox" class="filled-in"><span></span></label></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" id="Corte" type="checkbox" class="filled-in"><span></span></label></td>';
            }
            if (json.CorreosA[i].Confeccion) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" checked="true" id="Confeccion" type="checkbox" class="filled-in"><span></span></label></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" id="Confeccion" type="checkbox" class="filled-in"><span></span></label></td>';
            }
            if (json.CorreosA[i].ProcesosEspeciales) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" checked="true" id="ProcesosEspeciales" type="checkbox" class="filled-in"><span></span></label></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" id="ProcesosEspeciales" type="checkbox" class="filled-in"><span></span></label></td>';
            }
            if (json.CorreosA[i].Lavandería) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" checked="true" id="Lavanderia" type="checkbox" class="filled-in"><span></span></label></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" id="Lavanderia" type="checkbox" class="filled-in"><span></span></label></td>';
            }
            if (json.CorreosA[i].Terminado) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" checked="true" id="Terminado" type="checkbox" class="filled-in"><span></span></label></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align: center"><label><input disabled="disabled" id="Terminado" type="checkbox" class="filled-in"><span></span></label></td>';
            }
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="SetId(' + json.CorreosA[i].UsuarioId + ');" class="waves-effect waves-light red btn tooltipped modal-trigger" data-target="modalDeleteAlerta" data-position="bottom" data-tooltip="Elimina las alertas para el usuario seleccionado"><i class="material-icons right">delete</i></a></td>';
            sOptions += '</tr>';
            index++;
          }
          $('#tlbCorreosAuditoria').html('');
          // tslint:disable-next-line:max-line-length
          $('#tlbCorreosAuditoria').html('<thead><tr><th></th><th>No.</th><th>Correo Electrónico</th><th>Corte</th><th>Confección</th><th>Lavandería</th><th>Procesos Especiales</th><th>Terminado</th><th></th></tr></thead><tbody>' + sOptions + '</tbody>');
          $('#tlbCorreosAuditoria').DataTable({
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
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
  }

  SaveAlertasCorreo() {
    let Mensaje = '';
    // tslint:disable-next-line:max-line-length
    if ($('#Corte_New_Mail').prop('checked') || $('#Confeccion_New_Mail').prop('checked') || $('#Terminado_New_Mail').prop('checked') || $('#Lavanderia_New_Mail').prop('checked') || $('#ProcEsp_New_Mail').prop('checked')) {
      $.ajax({
        url: Globals.UriRioSulApi + 'CorreosElectronicos/NuevoCorreoCierreAuditoria',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        data: JSON.stringify({
            'USU_ID': $('#HDN_ID').val(),
            'Corte': $('#Corte_New_Mail').prop('checked'),
            'Confeccion': $('#Confeccion_New_Mail').prop('checked'),
            'ProcesosEspeciales': $('#ProcEsp_New_Mail').prop('checked'),
            'Lavanderia': $('#Lavanderia_New_Mail').prop('checked'),
            'Terminado': $('#Terminado_New_Mail').prop('checked')
        }),
        success: function (json) {
          if (json.Hecho === true) {
            $('#modalCorreos').modal('close');
            Mensaje = 'Se agrego correctamente la confirmación e alertas para cierre de modulos seleccionados';
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión con la base de datos');
        }
      });
    } else {
      this._toast.warning('Se debe seleccionar al ménos una alerta de cierre de auditoría', '');
    }
    if (Mensaje !== '') {
      this._toast.success(Mensaje, '');
      this.GetUsuarios();
    }
  }

  GetUsuarios() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'CorreosElectronicos/UsuariosNoRegistrados?Key=' + atob(Globals.PasswordKey),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.Usuarios.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="SetId(' + json.Usuarios[i].ID + '); DisposeCheckPerCorreo();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalCorreos" data-position="bottom" data-tooltip="Edita el usuario seleccionado"><i class="material-icons right">check</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Usuarios[i].Nombre + '</td>';
            sOptions += '<td>' + json.Usuarios[i].Usuario + '</td>';
            sOptions += '<td>' + json.Usuarios[i].Email + '</td>';
            sOptions += '</tr>';
            index++;
          }
          $('#tlbNuevoCierreAudiCorreo').html('');
          // tslint:disable-next-line:max-line-length
          $('#tlbNuevoCierreAudiCorreo').html('<thead><tr><td></td><td>No.</td><td>Nombre</td><td>Usuario</td><td>Email</td></tr></thead><tbody>' + sOptions + '</tbody>');
          $('#tlbNuevoCierreAudiCorreo').DataTable({
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
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
  }

  UpdateAlertasUsuario() {
    let Mensaje = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'CorreosElectronicos/EditaCierreAuditoria',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      async: false,
      data: JSON.stringify({
        'USU_ID': $('#HDN_ID').val(),
        'Corte': $('#Corte_Edt_Mail').prop('checked'),
        'Confeccion': $('#Confeccion_Edt_Mail').prop('checked'),
        'ProcesosEspeciales': $('#ProcEsp_Edt_Mail').prop('checked'),
        'Lavanderia': $('#Lavanderia_Edt_Mail').prop('checked'),
        'Terminado': $('#Terminado_Edt_Mail').prop('checked')
      }),
      success: function (json) {
        if (json.Hecho) {
          Mensaje = 'Se actualizo correctamente las alertas para el usuario';
        }
      },
      error: function () {
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
    if (Mensaje !== '') {
      this._toast.success(Mensaje, '');
      $('#modalEdtCorreos').modal('close');
      this.GetEmails();
    }
  }

  DeleteAlertaUsuario() {
    let Mensaje = '';
    $.ajax({
      // tslint:disable-next-line:max-line-length
      url: Globals.UriRioSulApi + 'CorreosElectronicos/EliminaUsuarioAuditoriaCorreo?Key=' + atob(Globals.PasswordKey) + '&USU_ID=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json) {
          Mensaje = 'Se eliminaron las alertas para el usaurio seleccionado';
        }
      },
      error: function () {
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
    if (Mensaje !== '') {
      this._toast.success(Mensaje, '');
      $('#modalDeleteAlerta').modal('close');
      this.GetEmails();
    }
  }
}
