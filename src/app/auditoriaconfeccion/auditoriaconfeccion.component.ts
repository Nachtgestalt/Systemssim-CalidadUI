import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auditoriaconfeccion',
  templateUrl: './auditoriaconfeccion.component.html',
  styleUrls: ['./auditoriaconfeccion.component.css']
})
export class AuditoriaconfeccionComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewAuditoria').modal();
    this.GetClients();
    this.GetDefectosCortadores();
    this.GetAreaConfeccion();
    $('#lblModulo').text('Confección - Auditoría');
  }

  GetClients() {
    const ddl = $('#ddlCliente');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cliente/ObtieneClientes',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        $('#ddlCliente').empty();
        if (json.length > 0) {
          for (let index = 0; index < json.length; index++) {
            if (index === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json[index].IdClienteRef).text(json[index].Descripcion));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json[index].IdClienteRef).text(json[index].Descripcion));
            }
          }
          $(ddl).formSelect();
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  GetDefectosCortadores() {
    const ddl = $('#ddlDefecto');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneDefecto',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlDefecto').empty();
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text( json.Vst_Cortadores[i].Descripcion));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text( json.Vst_Cortadores[i].Descripcion));
            }
          }
          $(ddl).formSelect();
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  GetAreaConfeccion() {
    const ddl = $('#ddlArea');
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneAreaConfeccion',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlArea').empty();
          for (let i = 0; i < json.Vst_Confeccion.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Confeccion[i].ID).text(json.Vst_Confeccion[i].Nombre));
            } else {
              $(ddl).append($('<option></option>').attr('value', json.Vst_Confeccion[i].ID).text(json.Vst_Confeccion[i].Nombre));
            }
          }
          $(ddl).formSelect();
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  GetOperacionConfeccion() {
    const ddl = $('#ddlOperacion');
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtieneOperacionConfeccion',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlOperacion').empty();
          for (let i = 0; i < json.Vst_Confeccion.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Confeccion[i].ID).text(json.Vst_Confeccion[i].Nombre));
            } else {
              $(ddl).append($('<option></option>').attr('value', json.Vst_Confeccion[i].ID).text(json.Vst_Confeccion[i].Nombre));
            }
          }
          $(ddl).formSelect();
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  GetAuditoriaCorte() {
    let sOptions = '';
    let _index_ = 1;
    $.ajax({
      url: Globals.UriRioSulApi + 'AuditoriaConfeccion/ObtieneAuditoriaConfeccion',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          for (let i = 0; i < json.RES.length; i++) {
            sOptions += '<tr>';
            sOptions += '<td></td>';
            sOptions += '<td>' + _index_ + '</td>';
            sOptions += '<td>' + json.RES[i].Descripcion + '</td>';
            sOptions += '<td>' + json.RES[i].OrdenTrabajo + '</td>';
            sOptions += '<td>' + json.RES[i].PO + '</td>';
            sOptions += '<td>' + json.RES[i].Tela + '</td>';
            sOptions += '<td>' + json.RES[i].Marca + '</td>';
            sOptions += '<td>' + json.RES[i].NumCortada + '</td>';
            sOptions += '<td>' + json.RES[i].Lavado + '</td>';
            sOptions += '<td>' + json.RES[i].Estilo + '</td>';
            sOptions += '<td>' + json.RES[i].Planta + '</td>';
            sOptions += '</tr>';

            _index_++;
          }
          $('#tlbConfeccionAuditoria').html('');
          $('#tlbConfeccionAuditoria').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbConfeccionAuditoria').append('<thead><th></th><th>No.</th><th>Cliente</th><th>Orden Trabajo</th><th>PO</th><th>Tela</th><th>Marca</th><th>NumCortada</th><th>Lavado</th><th>Estilo</th><th>Planta</th></thead>');
          $('#tlbConfeccionAuditoria').DataTable({
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

  DisposeNewConfeccion() {
    $('#ddlDefecto').val(0);
    $('#ddlDefecto').formSelect();
    $('#AUDIT_CANTIDAD').val('');
    $('#ddlArea').val(0);
    $('#ddlArea').formSelect();
    $('#ddlOperacion').formSelect();
    $('#ddlOT').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

  ValidateSave() {
    if (document.getElementById('bdyCorteAuditoria').getElementsByTagName('tr').length === 0) {
      this._toast.warning('Se debe agregar al menos un registro de cortador para realizar un cierre', '');
    } else {
      let Mensaje = '';
      const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
      $.ajax({
        url: Globals.UriRioSulApi + 'AuditoriaConfeccion/NuevaAuditoriaConfeccion',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        data: JSON.stringify({
          'IdClienteRef': $('#ddlCliente')[0].value,
          'OrdenTrabajo': $('#ddlOT').val(),
          'PO': document.getElementById('lblPO').innerText,
          'Tela': document.getElementById('lblTela').innerText,
          'Marca': document.getElementById('lblMarca').innerText,
          'NumCortada': document.getElementById('lblNoCortada').innerText,
          'Lavado': document.getElementById('lblLavado').innerText,
          'Estilo': document.getElementById('lblEstilo').innerText,
          'Planta': document.getElementById('lblPlanta').innerText,
          'Ruta': document.getElementById('lblRuta').innerText,
          'IdUsuario': Json_Usuario.ID,
          'Det': $('#HDN_ARR').val()
        }),
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            Mensaje = '';
          } else {
            Mensaje = 'No se agrego correctamente el cierre de auditoría';
          }
        },
        error: function () {
          console.log('No se pudo establecer coneción a la base de datos');
        }
      });
      if (Mensaje === '') {
        this._toast.success('Se agrego correctamente el cierre de auditoría de confección', '');
        $('#modalNewAuditoria').modal('close');
      } else {
        this._toast.warning(Mensaje, '');
      }
    }
  }

  ValidateAddConfeccionAuditoria() {
    if ($('#ddlCliente')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un cliente valido', '');
    } else if ($('#ddlOT').val() === '' ) {
      this._toast.warning('Se debe seleccionar una orden de trabajo valida', '');
    } else if ($('#ddlDefecto')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una posición valida', '');
    } else if ($('#AUDIT_CANTIDAD')[0].value === '' || $('#AUDIT_CANTIDAD')[0].value <= 0) {
      this._toast.warning('Se debe ingresar una cantidad valida', '');
    } else if ($('#ddlArea')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un área valida', '');
    } else if ($('#ddlOperacion')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una operación valida', '');
    } else if (this.GetOrdenTrabajo()) {
      this._toast.warning('La orden de trabajo ingreasada no es valida', '');
    } else {
      const tlb = $('#bdyCorteAuditoria');
      let sOptions = '';
      let _iindex = 1;
      for (let j = 0; j < document.getElementById('bdyCorteAuditoria').getElementsByTagName('tr').length; j++) {
        sOptions += '<tr>';
        sOptions += '<td>' + _iindex + '</td>';
        sOptions += '<td style="display: none;">' + tlb[0].rows[j].cells[1].innerText + '</td>';
        sOptions += '<td>' + tlb[0].rows[j].cells[2].innerText + '</td>';
        sOptions += '<td style="display: none;">' + tlb[0].rows[j].cells[3].innerText + '</td>';
        sOptions += '<td>' + tlb[0].rows[j].cells[4].innerText + '</td>';
        sOptions += '<td style="display: none;">' + tlb[0].rows[j].cells[5].innerText + '</td>';
        sOptions += '<td>' + tlb[0].rows[j].cells[6].innerText + '</td>';
        sOptions += '<td>' + tlb[0].rows[j].cells[7].innerText + '</td>';
        sOptions += '<td style="display: none">' + tlb[0].rows[j].cells[8].innerText + '</td>';
        sOptions += '</tr>';
        _iindex++;
      }
      sOptions += '<tr>';
      sOptions += '<td>' + _iindex + '</td>';
      sOptions += '<td style="display: none;">' + $('#ddlArea')[0].value + '</td>';
      sOptions += '<td>' +  $('#ddlArea option:selected').text() + '</td>';
      sOptions += '<td style="display: none;">' + $('#ddlOperacion')[0].value + '</td>';
      sOptions += '<td>' + $('#ddlOperacion option:selected').text() + '</td>';
      sOptions += '<td style="display: none;">' + $('#ddlDefecto')[0].value + '</td>';
      sOptions += '<td>' + $('#ddlDefecto option:selected').text() + '</td>';
      sOptions += '<td>' + $('#AUDIT_CANTIDAD').val() + '</td>';
      sOptions += '<td style="display: none">' + ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src) + '</td>';
      sOptions += '</tr>';
      $('#tlbConfeccionAuditoria').html();
      $('#tlbConfeccionAuditoria').html('<tbody id="bdyConfeccionAuditoria">' + sOptions + '</tbody>');
      // tslint:disable-next-line:max-line-length
      $('#tlbConfeccionAuditoria').append('<thead><tr><th>No.</th><th style="display:none"></th><th>Área</th><th style="display:none"></th><th>Operación</th><th style="display:none"></th><th>Defecto</th><th>Cantidad</th><th style="display: none"></th></tr></thead>');
      $('#tlbConfeccionAuditoria').DataTable({
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
      this.DisposeNewConfeccion();
    }
  }

  GetOrdenTrabajo(): boolean {
    let Result = false;
    $.ajax({
      // tslint:disable-next-line:max-line-length
      url: Globals.UriRioSulApi + 'AuditoriaCorte/ObtieneOrdenesTrabajoDynamics?IdClienteRef=' + $('#ddlCliente').val() + '&OrdenT=' + $('#ddlOT').val(),
          dataType: 'json',
          contents: 'application/json; charset=utf-8',
          method: 'get',
          async: false,
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              for (let index = 0; index < json.OrdenTrabajo.length; index++) {
                Result = true;
              }
            }
          },
          error: function () {
            console.log('No se ha podido establecer conexión');
          }
    });
    return Result;
  }

}
