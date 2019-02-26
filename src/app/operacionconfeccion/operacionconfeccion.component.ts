import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-operacionconfeccion',
  templateUrl: './operacionconfeccion.component.html',
  styleUrls: ['./operacionconfeccion.component.css']
})
export class OperacionconfeccionComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalEnableOperacionConfeccion').modal();
    $('#modalNewOperacionConfeccion').modal();
    $('#modalEditOperacionConfeccion').modal();
    $('#lblModulo').text('Confección - Operación');
  }

  DisposeNewOperacionConfeccion() {
    $('#CLAVE_NEW_OPERACION').val('');
    $('#DESCRIPCION_NEW_OPERACION').val('');
    $('#modalNewOperacionConfeccion').val('');
    this.GetPosicionDefectosActivos();
  }

  GetOperacionConfeccion() {
    let sOptions = '';
    let _request = '';
    if ($('#CLAVE_OPERACION').val() !== '' && $('#DESCRIPCION_OPERACION').val() === '') {
      _request += '?Clave=' +  $('#CLAVE_OPERACION').val();
    } else if ($('#DESCRIPCION_OPERACION').val() !== '' && $('#CLAVE_OPERACION').val() === '') {
      _request += '?Nombre=' +  $('#DESCRIPCION_OPERACION').val();
    }
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneOperacionConfeccion' + _request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.Vst_Confeccion.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Confeccion[i].ID + '); DisposeEditOperaciones(); GetInfoOperacionConfeccion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditOperacionConfeccion" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Vst_Confeccion[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_Confeccion[i].Nombre + '</td>';
            if (json.Vst_Confeccion[i].Activo) {
              sOptions += '<td style="text-align: center">SI</td>';
            } else {
              sOptions += '<td style="text-align: center">NO</td>';
            }
            if (json.Vst_Confeccion[i].Activo === true) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableOperacionConfeccion" data-tooltiped="Activa / Inactiva la operación seleccionada"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableOperacionConfeccion" data-tooltiped="Activa / Inactiva la operación seleccionada"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbOperacionConfeccion').html('');
          $('#tlbOperacionConfeccion').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbOperacionConfeccion').append('<thead><th></th><th>No.</th><th>Clave Operación</th><th>Nombre Operación</th><th>Estatus</th><th></th></thead>');
          $('#tlbOperacionConfeccion').DataTable({
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

  GetEnabledOperacion() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ActivaInactivaOperacionConfeccion?IdOperacion=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableOperacionConfeccion').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetOperacionConfeccion();
  }

  NewOperacionConfeccion() {
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición de la operación', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción de la operación', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Confeccion/ValidaOperacionSubModulo?SubModulo=9&Clave=' + $('#CLAVE_NEW_OPERACION').val() + '&Nombre=' + $('#DESCRIPCION_NEW_OPERACION').val(),
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
          url: Globals.UriRioSulApi + 'Confeccion/NuevoOperacionConfeccion',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 9,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CLAVE_NEW_OPERACION').val(),
            Nombre: $('#DESCRIPCION_NEW_OPERACION').val(),
            Descripcion: '',
            Observaciones: '',
            Imagen: $('#HDN_ARR').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente la operación de confección';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewOperacionConfeccion').modal('close');
        }
      } else {
        this._toast.warning('La clave de operación ya se encuentra registrada en el sistema', '');
      }
    }
  }

  GetPosicionDefectosActivos() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneDefectosActivosOperacion',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let Index = 1;
          for (let i = 0; i < json.Vst_Confeccion.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td style="text-align:center"><label><input id="chk_' + json.Vst_Confeccion[i].ID + '" type="checkbox" class="filled-in" /><span></span></label></td>';
            sOptions += '<td>' + Index + '</td>';
            sOptions += '<td>' + json.Vst_Confeccion[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_Confeccion[i].Nombre + '</td>';
            sOptions += '</tr>';

            Index++;
          }
          $('#tlbOperacionDefecto').html('');
          $('#tlbOperacionDefecto').html('<tbody id="tdby_Posicion">' + sOptions + '</tbody>');
          $('#tlbOperacionDefecto').append('<thead><th></th><th>No.</th><th>Clave Defecto</th><th>Nombre Defecto</th></thead>');
          $('#tlbOperacionDefecto').DataTable({
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

  EditOperacionConfeccion() {
    console.log('cambiar');
  }
}
