import {Component, OnInit} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
declare var jQuery: any;
import 'jquery';
import {ToastrService} from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-procesosespecialesdefectos',
  templateUrl: './procesosespecialesdefectos.component.html',
  styleUrls: ['./procesosespecialesdefectos.component.css']
})
export class ProcesosespecialesdefectosComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoProcesosEspeciales').modal();
    $('#modalEditDefectoProcesosEspeciales').modal();
    $('#modalEnableDefectoProcesosEspeciales').modal();
    $('#lblModulo').text('Procesos Especiales - Defectos');
    this.GetDefectosProcesosEspeciales();
  }

  GetDefectosProcesosEspeciales() {
    let sOptions = '';
    let _request = '';
    // if ($('#CLAVE_PROCESO_ESPECIAL').val() !== '' && $('#NOMBRE_PROCESO_ESPECIAL').val() === '') {
    //   _request += '?Clave=' +  $('#CLAVE_PROCESO_ESPECIAL').val();
    // } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_PROCESO_ESPECIAL').val() === '') {
    //   _request += '?Nombre=' +  $('#NOMBRE_PROCESO_ESPECIAL').val();}

    _request += '?Nombre=' + $('#NOMBRE_PROCESO_ESPECIAL').val() + '?Clave=' + $('#CLAVE_PROCESO_ESPECIAL').val();

    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtieneDefectoProseso' + _request,
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
            sOptions += '<td><a onclick="javascript: SetId(' + json.Vst_ProcesosEspeciales[i].ID + '); DisposeEditDefectoProcesosEspeciales(); GetInfoProcesosEspeciales();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditDefectoProcesosEspeciales" data-position="bottom" data-tooltip="Edita el defecto de proceso especial seleccionado"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + index + '</td>';
            sOptions += '<td>' + json.Vst_ProcesosEspeciales[i].Clave + '</td>';
            sOptions += '<td>' + json.Vst_ProcesosEspeciales[i].Nombre + '</td>';
            if (json.Vst_ProcesosEspeciales[i].Activo) {
              sOptions += '<td style="text-align: center">SI</td>';
            } else {
              sOptions += '<td style="text-align: center">NO</td>';
            }
            if (json.Vst_ProcesosEspeciales[i].Activo === true) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_ProcesosEspeciales[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoProcesosEspeciales" data-tooltiped="Activa / Inactiva el proceso especial seleccionado"><strong><u>Inactivar</u></strong></a></td>';
            } else {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_ProcesosEspeciales[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoProcesosEspeciales" data-tooltiped="Activa / Inactiva el proceso especial seleccionado"><strong><u>Activar</u></strong></a></td>';
            }
            sOptions += '</tr>';
            index++;
          }
          $('#tlbDefectoProcesosEspeciales').html('');
          $('#tlbDefectoProcesosEspeciales').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbDefectoProcesosEspeciales').append('<thead><th></th><th>No.</th><th>Clave Proceso Especial</th><th>Nombre Proceso Especial</th><th>Estatus</th><th></th></thead>');
          $('#tlbDefectoProcesosEspeciales').DataTable({
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

  GetEnabledDefectoProcesosEspeciales() {
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ActivaInactivaDefectoProcesoEsp?IdProcesoEspecial=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableDefectoProcesosEspeciales').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.GetDefectosProcesosEspeciales();
  }

  NewDefectoProcesosEspeciales() {
    if ($('#CVE_NEW_PROCESOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_PROCEOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    } else if ($('#OBSERVACIONES_NEW_PROCESOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del defecto procesos especiales', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaProcesoEspecialSubModulo?SubModulo=27&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
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
          url: Globals.UriRioSulApi + 'ProcesosEspeciales/NuevoDefectoProceso',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 1,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_NEW_PROCESOS_ESPECIALES').val(),
            Nombre: $('#NOMBRE_NEW_PROCESOS_ESPECIALES').val(),
            Descripcion: $('#DESCRIPCION_NEW_PROCESOS_ESPECIALES').val(),
            Observaciones: $('#OBSERVACIONES_NEW_PROCESOS_ESPECIALES').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto procesos especiales';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalNewDefectoProcesosEspeciales').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto procesos especiales ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditDefectoProcesosEspeciales() {
    if ($('#CVE_EDT_PROCESOS_ESPECIALES').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto procesos especiales', '');
    } else if ($('#CVE_EDT_DEFECTO_PROC_ESP').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto cortador', '');
    } else if ($('#OBSERVACIONES_EDT_DEFECTO_PROC_ESP').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones de procesos especiales', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'ProcesosEspeciales/ValidaDefectoSubModuloProcesosEspeciales?SubModulo=27&Clave=' + $('#CVE_EDT_DEFECTO').val() + '&Nombre=' + $('#NOMBRE_EDT_DEFECTO').val(),
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
          url: Globals.UriRioSulApi + 'ProcesosEspeciales/ActualizaDefectoProcesosEspeciales',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            ID: $('#HDN_ID').val(),
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_EDT_DEFECTO_PROC_ESP').val(),
            Nombre: $('#NOMBRE_EDT_DEFECTO_PROC_ESP').val(),
            Descripcion: $('#DESCRIPCION_EDT_DEFECTO_PROC_ESP').val(),
            Observaciones: $('#OBSERVACIONES_EDT_DEFECTO_PROC_ESP').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto proceso especial';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this._toast.success(Mensaje, '');
          $('#modalEditDefectoProcesosEspeciales').modal('close');
        }
      } else {
        this._toast.warning('La clave defecto proceso especial ya se encuentra registrada en el sistema', '');
      }
    }
  }

  DisposeNewProcesosEspeciales() {
    $('#CVE_NEW_PROCESOS_ESPECIALES').val('');
    $('#NOMBRE_NEW_PROCEOS_ESPECIALES').val('');
    $('#DESCRIPCION_NEW_PROCESOS_ESPECIALES').val('');
    $('#OBSERVACIONES_NEW_PROCESOS_ESPECIALES').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

}
