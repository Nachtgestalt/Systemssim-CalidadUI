import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';
@Component({
  selector: 'app-lavanderiaoperaciones',
  templateUrl: './lavanderiaoperaciones.component.html',
  styleUrls: ['./lavanderiaoperaciones.component.css']
})
export class LavanderiaoperacionesComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('#lblModulo').text('Lavandería - Operaciones');
    $('.tooltipped').tooltip();
    $('#modalEnableOperacionProcesosEspeciales').modal();
    $('#modalNewOperacionProcesosEspeciales').modal();
    $('#modalEditOperacionProcesosEspeciales').modal();
    this.GetOperacionLavanderia();
  }

  DisposeNewOperacionProcesosEspeciales() {
    $('#CLAVE_NEW_OPERACION').val('');
    $('#DESCRIPCION_NEW_OPERACION').val('');
    $('#modalNewOperacionConfeccion').val('');
    $('#lblModulo').text('Procesos Especiales - Operaciones');
    // this.GetPosicionDefectosActivos();
  }

  GetOperacionLavanderia() {
    let sOptions = '';
    let _request = '';
    if ($('#CLAVE_OPERACION').val() !== '' && $('#DESCRIPCION_OPERACION').val() === '') {
      _request += '?Clave=' +  $('#CLAVE_OPERACION').val();
    } else if ($('#DESCRIPCION_OPERACION').val() !== '' && $('#CLAVE_OPERACION').val() === '') {
      _request += '?Nombre=' +  $('#DESCRIPCION_OPERACION').val();
    }
    $.ajax({
      url: Globals.UriRioSulApi + 'Lavanderia/ObtieneOperacionLavanderia' + _request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let index = 1;
          for (let i = 0; i < json.Vst_Lavanderia.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_Lavanderia[i].ID + '); DisposeEditOperaciones(); GetInfoOperacionProcesosEspeciales();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditOperacionProcesosEspeciales" data-position="bottom" data-tooltip="Edita el defecto  seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Vst_Lavanderia[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_Lavanderia[i].Nombre + '</td>';
            // tslint:disable-next-line:max-line-length
            if (json.Vst_Lavanderia[i].Activo) {
              sOptions += '<td style="text-align: center">SI</td>';
            } else {
              sOptions += '<td style="text-align: center">NO</td>';
            }
            if (json.Vst_Lavanderia[i].Activo === true) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Lavanderia[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableOperacionProcesosEspeciales" data-tooltiped="Activa / Inactiva la operación seleccionada"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Lavanderia[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableOperacionProcesosEspeciales" data-tooltiped="Activa / Inactiva la operación seleccionada"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index ++;
          }
          $('#tlbOperacionProcesosEspeciales').html('');
          $('#tlbOperacionProcesosEspeciales').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbOperacionProcesosEspeciales').append('<thead><th></th><th>No.</th><th>Clave Operación</th><th>Nombre Operación</th><th>Estatus</th><th></th></thead>');
          $('#tlbOperacionProcesosEspeciales').DataTable({
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

  EditOperacionProcesosEspeciales() {
    console.log('modulo');
  }

  NewOperacionProcesosEspeciales() {
    if ($('#CLAVE_NEW_OPERACION').val() === '') {
      this._toast.warning('Se debe ingresar una clave de operación para procesos especiales', '');
    } else if ($('#DESCRIPCION_OPERACION').val()) {
      this._toast.warning('Se debe ingresar una descripción de la operación para procesos especailes', '');
    } else {
      let Result = false;
      // $.ajax({
      //   // tslint:disable-next-line:max-line-length
      //   url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaOperacionSubModuloProcesosEspeciales?SubModulo=13&Clave=' + $('#CLAVE_NEW_OPERACION').val() + '&Nombre=' + $('#DESCRIPCION_NEW_OPERACION').val(),
      //   dataType: 'json',
      //   contents: 'application/json; charset=utf-8',
      //   method: 'get',
      //   async: false,
      //   success: function (json) {
      //     if (json.Message.IsSuccessStatusCode) {
      //       Result = json.Hecho;
      //     }
      //   },
      //   error: function () {
      //     console.log('No se pudo establecer conexión a la base de datos');
      //   }
      // });
      // if (Result) {
        let Mensaje = '';
        const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
        $.ajax({
          url: Globals.UriRioSulApi + 'Lavanderia/NuevaOperacionLavanderia',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 19,
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
          $('#modalNewOperacionProcesosEspeciales').modal('close');
        }
      // } else {
      //   this._toast.warning('La clave de operación ya se encuentra registrada en el sistema', '');
      // }
    }
  }

  GetEnabledOperacionProcesosEspeciales() {
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ActivaInactivaOperacionesProcesosEspeciales?IdOperacion=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableOperacionProcesosEspeciales').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetOperacionLavanderia();
  }
}
