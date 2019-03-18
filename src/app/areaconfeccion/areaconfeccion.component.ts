import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-areaconfeccion',
  templateUrl: './areaconfeccion.component.html',
  styleUrls: ['./areaconfeccion.component.css']
})
export class AreaconfeccionComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalEnableAreaConfeccion').modal();
    $('#modalNewAreaConfeccion').modal();
    $('#modalEditAreaConfeccion').modal();
    $('#lblModulo').text('Confección - Área');
    this.GetAreaConfeccion();
  }

  DisposeNewAreaConfeccion() {
    $('#CLAVE_NEW_OPERACION').val('');
    $('#DESCRIPCION_NEW_OPERACION').val('');
    $('#modalNewOperacionConfeccion').val('');
    this.GetOperacionesAreas();
  }

  GetAreaConfeccion() {
    let sOptions = '';
    let _request = '';
    if ($('#CLAVE_OPERACION').val() !== '' && $('#DESCRIPCION_OPERACION').val() === '') {
      _request += '?Clave=' +  $('#CLAVE_OPERACION').val();
    } else if ($('#DESCRIPCION_OPERACION').val() !== '' && $('#CLAVE_OPERACION').val() === '') {
      _request += '?Nombre=' +  $('#DESCRIPCION_OPERACION').val();
    }
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneAreaConfeccion' + _request,
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
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Confeccion[i].ID + '); DisposeEditArea(); GetInfoOperacionConfeccion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditAreaConfeccion" data-position="bottom" data-tooltip="Edita el área seleccionada"><i class="material-icons right">edit</i></a></td>';
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
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableAreaConfeccion" data-tooltiped="Activa / Inactiva el área seleccionada"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableAreaConfeccion" data-tooltiped="Activa / Inactiva el área seleccionada"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbAreaConfeccion').html('');
          $('#tlbAreaConfeccion').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbAreaConfeccion').append('<thead><th></th><th>No.</th><th>Clave Área</th><th>Nombre Área</th><th>Estatus</th><th></th></thead>');
          $('#tlbAreaConfeccion').DataTable({
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

  GetEnabledArea() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ActivaInactivaAreaConfeccion?IdOperacion=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableAreaConfeccion').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetAreaConfeccion();
  }

  NewAreaConfeccion() {
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de posición del área', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción del área', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Confeccion/ValidaAreaSubModulo?SubModulo=10&Clave=' + $('#CLAVE_NEW_OPERACION').val() + '&Nombre=' + $('#DESCRIPCION_NEW_OPERACION').val(),
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
          url: Globals.UriRioSulApi + 'Confeccion/NuevoAreaConfeccion',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 10,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CLAVE_NEW_OPERACION').val(),
            Nombre: $('#DESCRIPCION_NEW_OPERACION').val(),
            Descripcion: '',
            Observaciones: '',
            Imagen: $('#HDN_ARR').val()
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el área de confección';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewAreaConfeccion').modal('close');
        }
      } else {
        this._toast.warning('La clave de área ya se encuentra registrada en el sistema', '');
      }
    }
  }

  GetOperacionesAreas() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneOperacionAreas',
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
          $('#tlbOperacionDefecto').append('<thead><th></th><th>No.</th><th>Clave Operación</th><th>Nombre Operación</th></thead>');
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

  EditAreaConfeccion() {
    console.log('cambiar');
  }

}
