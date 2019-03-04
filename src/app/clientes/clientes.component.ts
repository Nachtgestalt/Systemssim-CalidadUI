import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { Globals } from '../Globals';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('#mdlDetalle').modal();
    $('.tooltipped').tooltip();
    $('#mdlNewRefCru').modal();
    $('#mdlNewCliRef').modal();
    $('#lblModulo').text('Catálogo Clientes');
    this.GetClientsRefCru();
  }

  GetClientsRefCru() {
    let sOptions = '';
    let _request = '';
    if ($('#CLI_OBSERVACION').val() !== '') {
      _request += '?Observacion=' + $('#CLI_OBSERVACION').val();
    }
    if ($('#CLI_DESCRIPCION').val() !== '') {
      _request += '?Descripcion=' + $('#CLI_DESCRIPCION').val();
    }
    // if (_request !== '') {
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cliente/ObtieneClientes' + _request,
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.length > 0) {
            for (let index = 0; index < json.length; index++) {
              sOptions += '<tr>';
              // tslint:disable-next-line:max-line-length
              sOptions += '<td><a onclick="javascript: SetId(' + json[index].IdClienteRef + '); ObtieneReferenciasPorCliente();" class="btn tooltipped waves-effect waves-light modal-trigger" data-target="mdlDetalle"><strong><u>Detallar</u></strong></a></td>';
              sOptions += '<td>' + json[index].Descripcion  + '</td>';
              sOptions += '<td>' + json[index].Observaciones + '</td>';
              sOptions += '</tr>';
            }
            $('#tlbClientesRefCru').html('');
            $('#tlbClientesRefCru').html('<tbody>' + sOptions + '</tbody>');
            $('#tlbClientesRefCru').append('<thead><tr><th></th><th>Descripción</th><th>Observación</th></tr></thead>');
            $('#tlbClientesRefCru').DataTable({
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
          } else {
            $('#tlbClientesRefCru').html('');
            $('#tlbClientesRefCru').append('<thead><tr><th></th><th>Descripción</th><th>Observación</th></tr></thead><tbody></tbody>');
            $('#tlbClientesRefCru').DataTable({
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
          }
        },
        error: function () {
          console.log('No se pudo establecer coneción a la base de datos');
        }
      });
    // } else {
    //   this._toast.warning('Debe seleccionar al ménos un filtro de búsqueda', '');
    // }
  }

  GetClients() {
    let sOptions = '';
    const _busqueda = $('#BUS_CLIENTE').val();
    if (_busqueda.length >= 3) {
      $.ajax({
        url: Globals.UriRioSulApi + 'Cliente/ObtieneClientesDynamics?BusquedaCliente=' + $('#BUS_CLIENTE').val(),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            for (let i = 0; i < json.Clientes.length; i++) {
              sOptions += '<tr id="' + json.Clientes[i].cve_cliente + '" onclick="OnClickIdTable(' + i + ');">';
              sOptions += '<td>' + json.Clientes[i].cve_cliente + '</td>';
              sOptions += '<td>' + json.Clientes[i].nom_cliente + '</td>';
              sOptions += '<td>' + json.Clientes[i].nom_corto + '</td>';
              sOptions += '<td>' + json.Clientes[i].nUm_rfc + '</td>';
              sOptions += '<td>' + json.Clientes[i].nom_estatus + '</td>';
              sOptions += '<td>' + json.Clientes[i].num_cp + '</td>';
              sOptions += '<td>' + json.Clientes[i].nom_contacto + '</td>';
              sOptions += '</tr>';
            }
            $('#tlbClientes').html('');
            $('#tlbClientes').html('<tbody id="tbdy_Clientes_Ref">' +  sOptions + '</tbody>');
            // tslint:disable-next-line:max-line-length
            $('#tlbClientes').append('<thead><tr><th>Clave</th><th>Nombre</th><th>Siglas</th><th>Rfc</th><th>Estatus</th><th>C.P.</th><th>Contacto</th></tr></thead>');
            $('#tlbClientes').DataTable({
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
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión con la base de datos');
        }
      });
    } else {
      this._toast.warning('El filtro de búsqueda debe ser mayor a 3 caracteres');
    }
  }

  ValidateRowsTableSelect() {
    if ($('#HDN_VALIDATE').val() === '0') {
      this._toast.warning('Debe seleccionar al ménos un cliente de la tabla');
      return false;
    } else {
      return true;
    }
  }

  DisposeRegistrosTabla() {
    $('#BUS_CLIENTE').val('');
    $('#tlbClientes').html('');
    // tslint:disable-next-line:max-line-length
    $('#tlbClientes').append('<thead><tr><th>Clave</th><th>Nombre</th><th>Siglas</th><th>Rfc</th><th>Estatus</th><th>C.P.</th><th>Contacto</th></tr></thead><tbody id="tbdy_Clientes_Ref"></tbody>');
    $('#tlbClientes').DataTable({
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
  }

  SaveClient() {
    let Mensaje = '';
    if ($('#CLI_NOMBRE_NEW').val() === '') {
      this._toast.warning('Se debe registrar un nombre del cliente', '');
    } else if ($('#CLI_OBSERVACIONES_NEW').val() === '') {
      this._toast.warning('Se debe registrar las observaciones del cliente', '');
    } else {
      $.ajax({
        url: Globals.UriRioSulApi + 'Cliente/GuardaReferenciaCruzada',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        data: JSON.stringify({
          'Descripcion': $('#CLI_NOMBRE_NEW').val(),
          'Observaciones': $('#CLI_OBSERVACIONES_NEW').val(),
          'CLI_REF': $('#HDN_ARR').val()
        }),
        success: function (json) {
          if (json.Message.StatusCode === 'OK' || json.Message.StatusCode === 200) {
            Mensaje = '';
          } else {
            Mensaje = 'No se pudo guardar la referencia del cliente';
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión');
          Mensaje = 'No se pudo establecer conexión';
        }
      });
    }
    if (Mensaje === '') {
      this._toast.success('Se agrego correctamente la referencia del cliente', '');
      $('#mdlNewCliRef').modal('close');
      $('#mdlNewRefCru').modal('close');
    } else {
      this._toast.warning(Mensaje, '');
    }
  }

}
