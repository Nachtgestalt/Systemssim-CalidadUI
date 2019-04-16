import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-defectoconfeccion',
  templateUrl: './defectoconfeccion.component.html',
  styleUrls: ['./defectoconfeccion.component.css']
})
export class DefectoconfeccionComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoConfeccion').modal();
    $('#modalEditDefectoConfeccion').modal();
    $('#modalEnableDefectoConfeccion').modal();
    $('#lblModulo').text('Confección - Defectos');
    this.GetDefectosConfeccion();
  }

  GetDefectosConfeccion() {
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
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneDefectoConfeccion' + _request,
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
            sOptions += '<td><a onclick="SetId(' + json.Vst_Confeccion[i].ID + '); DisposeEditDefectoConfeccion(); GetInfoDefectoConfeccion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditDefectoConfeccion" data-position="bottom" data-tooltip="Edita el defecto confección seleccionado"><i class="material-icons right">edit</i></a></td>';
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
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoConfeccion" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoConfeccion" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbDefectoConfeccion').html('');
          $('#tlbDefectoConfeccion').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbDefectoConfeccion').append('<thead><th></th><th>No.</th><th>Clave Defectos</th><th>Nombre Defectos</th><th>Estatus</th><th></th></thead>');
          $('#tlbDefectoConfeccion').DataTable({
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

  GetEnabledDefectoConfeccion() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ActivaInactivaDefectoConfeccion?IdDefecto=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableDefectoConfeccion').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetDefectosConfeccion();
  }

  NewDefectoConfeccion() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto confección', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto confección', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del defecto confección', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Confeccion/ValidaDefectoConfeccionSubModulo?SubModulo=6&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'Confeccion/NuevoDefectoConfeccion',
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
              Mensaje = 'Se agrego correctamente el defecto confección';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewDefectoConfeccion').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditDefectoConfeccion() {
    if ($('#CVE_EDT_DEFECTO_CONFECCION').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto confección', '');
    } else if ($('#NOMBRE_EDT_DEFECTO_CONFECCION').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto confección', '');
    } else if ($('#OBSERVACIONES_EDT_DEFECTO_CONFECCION').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del confección', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Confeccion/ValidaDefectoConfeccionSubModulo?SubModulo=6&Clave=' + $('#CVE_EDT_DEFECTO_CONFECCION').val() + '&Nombre=' + $('#NOMBRE_EDT_DEFECTO_CONFECCION').val(),
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
          url: Globals.UriRioSulApi + 'Confeccion/ActualizaDefectoConfeccion',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_DEFECTO_CONFECCION').val(),
            Nombre: $('#NOMBRE_EDT_DEFECTO_CONFECCION').val(),
            Descripcion: $('#DESCRIPCION_EDT_DEFECTO_CONFECCION').val(),
            Observaciones: $('#OBSERVACIONES_EDT_DEFECTO_CONFECCION').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto confección';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditDefectoConfeccion').modal('close');
        }
      } else {
        this._toast.warning('La clave defecto confección ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewDefectoConfeccion() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

}
