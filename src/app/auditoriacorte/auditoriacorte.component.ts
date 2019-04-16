import {Component, OnInit} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
import 'jquery';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-auditoriacorte',
  templateUrl: './auditoriacorte.component.html',
  styleUrls: ['./auditoriacorte.component.css']
})

export class AuditoriacorteComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewAuditoria').modal();
    $('#modalDetailsAuditoria').modal();
    $('#modalCloseAuditoria').modal();
    $('select').formSelect();
    this.GetCortadores();
    this.GetPosicionCortador();
    this.GetDefectosCortadores();
    this.GetSeries();
    this.GetTolerancias();
    $('#lblModulo').text('Corte - Auditoría');
  }

  GetClients() {
    // const ddl = $('#ddlCliente');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cliente/ObtieneClientes',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        // $('#ddlCliente').empty();
        if (json.length > 0) {
          for (let index = 0; index < json.length; index++) {
            if (index === 0) {
              /*$(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json[index].IdClienteRef).text(json[index].Descripcion));*/
            } else {
              // tslint:disable-next-line:max-line-length
              // $(ddl).append($('<option></option>').attr('value', json[index].IdClienteRef).text(json[index].Descripcion));
            }
          }
          // $(ddl).formSelect();
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  GetCortadores() {
    const ddl = $('#ddlCortador');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneCortadores',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlCortador').empty();
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
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

  GetPosicionCortador() {
    const ddl = $('#ddlPosicion');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtienePosicion',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlPosicion').empty();
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
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
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
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

  GetSeries() {
    const ddl = $('#ddlSerie');
    $.ajax({
      url: Globals.UriRioSulApi + 'AuditoriaCorte/ObtieneSerieAuditoria',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlSerie').empty();
          for (let i = 0; i < json.Serie.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Serie[i].Series).text(json.Serie[i].Series));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Serie[i].Series).text(json.Serie[i].Series));
            }
            $(ddl).formSelect();
          }
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  GetTolerancias() {
    const ddl = $('#ddlCortado');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneTolerancias',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          for (let i = 0; i < json.Tolerancias.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Tolerancias[i].IdTolerancia).text('Numerador:' + json.Tolerancias[i].Numerador + '/Denominador:' + json.Tolerancias[i].Denominador));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Tolerancias[i].IdTolerancia).text('Numerador:' + json.Tolerancias[i].Numerador + '/Denominador:' + json.Tolerancias[i].Denominador));
            }
            $(ddl).formSelect();
          }
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
  }

  ValidateSave() {
    if (document.getElementById('bdyCorteAuditoria').getElementsByTagName('tr').length === 0) {
      this._toast.warning('Se debe agregar al menos un registro de cortador para realizar un cierre', '');
    } else {
      let Mensaje = '';
      const bdy = $('#bdyCorteAuditoria');
      const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
      $.ajax({
        url: Globals.UriRioSulApi + 'AuditoriaCorte/NuevaAuditoriaCorte',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        data: JSON.stringify({
          'IdClienteRef': $('#ddlCliente').val(),
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
        this._toast.success('Se agrego correctamente el cierre de auditoría de corte', '');
        $('#modalNewAuditoria').modal('close');
      } else {
        this._toast.warning(Mensaje, '');
      }
    }
  }

  DisposeNewRowCortador() {
    $('#ddlCortador').val(0);
    $('#ddlCortador').formSelect();
    $('#ddlSerie').val(0);
    $('#ddlSerie').formSelect();
    $('#ddlNoBulto').val(0);
    $('#ddlNoBulto').formSelect();
    $('#ddlPosicion').val(0);
    $('#ddlPosicion').formSelect();
    $('#ddlDefecto').val(0);
    $('#ddlDefecto').formSelect();
    $('#ddlCortado').val(0);
    $('#ddlCortado').formSelect();
    $('#AUDIT_CANTIDAD').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

  ValidateAddCortadorAuditoria() {
    console.log('ValidateAddCortadorAuditoria');
    if ($('#ddlCliente').val() === null) {
      this._toast.warning('Se debe seleccionar un cliente valido', '');
    } else if ($('#ddlOT').val() === '') {
      this._toast.warning('Se debe seleccionar una orden de trabajo valida', '');
    } else if ($('#ddlSerie')[0].value === '0') {
      this._toast.warning('Se debe serleccionar una serie valida', '');
      // } else if ($('#ddlNoBulto')[0].value === '0') {
      //   this._toast.warning('Se debe seleccionar un número de bulto valido', '');
    } else if ($('#ddlPosicion')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una posición valida', '');
    } else if ($('#ddlDefecto')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una posición valida', '');
    } else if ($('#ddlCortado')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una tolerancia valida', '');
    } else if ($('#AUDIT_CANTIDAD')[0].value === '' || $('#AUDIT_CANTIDAD')[0].value <= 0) {
      this._toast.warning('Se debe ingresar una cantidad valida', '');
    } else {
      const tlb = $('#bdyCorteAuditoria');
      let sOptions = '';
      let _iindex = 1;
      for (let j = 0; j < document.getElementById('bdyCorteAuditoria').getElementsByTagName('tr').length; j++) {
        sOptions += '<tr>';
        sOptions += '<td>' + _iindex + '</td>'; // NO
        sOptions += '<td style="display:none">' + tlb[0].rows[j].cells[1].innerText + '</td>'; // ID CORTADOR
        sOptions += '<td>' + tlb[0].rows[j].cells[2].innerText + '</td>'; // #CORTADOR
        sOptions += '<td>' + tlb[0].rows[j].cells[3].innerText + '</td>'; // SERIE
        sOptions += '<td>' + tlb[0].rows[j].cells[4].innerText + '</td>'; // BULTO
        sOptions += '<td style="display:none">' + tlb[0].rows[j].cells[5].innerText + '</td>';  // ID_POSICION
        sOptions += '<td>' + tlb[0].rows[j].cells[6].innerText + '</td>'; // POSICION
        sOptions += '<td style="display:none">' + tlb[0].rows[j].cells[7].innerText + '</td>'; // ID_DEFECTO
        sOptions += '<td>' + tlb[0].rows[j].cells[8].innerText + '</td>'; // DEFECTO
        sOptions += '<td style="display:none">' + tlb[0].rows[j].cells[9].innerText + '</td>'; // ID_TOLERANCIA
        sOptions += '<td>' + tlb[0].rows[j].cells[10].innerText + '</td>'; // TOLERANCIA
        sOptions += '<td>' + tlb[0].rows[j].cells[11].innerText + '</td>'; // CANTIDAD
        sOptions += '<td style="display:none">' + tlb[0].rows[j].cells[12].innerText + '</td>'; // IMAGEN
        sOptions += '</tr>';
        _iindex++;
      }
      sOptions += '<tr>';
      sOptions += '<td>' + _iindex + '</td>'; // NO
      sOptions += '<td style="display: none">' + $('#ddlCortador')[0].value + '</td>'; // ID_CORTADOR
      sOptions += '<td>' + $('#ddlCortador option:selected').text() + '</td>'; // #CORTADOR
      sOptions += '<td>' + $('#ddlSerie option:selected').text() + '</td>'; // SERIE
      sOptions += '<td>' + $('#ddlNoBulto option:selected').text() + '</td>'; // BULTO
      sOptions += '<td style="display:none">' + $('#ddlPosicion')[0].value + '</td>'; // ID_POSICION
      sOptions += '<td>' + $('#ddlPosicion option:selected').text() + '</td>'; // POSICION
      sOptions += '<td style="display: none">' + $('#ddlDefecto')[0].value + '</td>'; // ID_DEFECTO
      sOptions += '<td>' + $('#ddlDefecto option:selected').text() + '</td>'; // DEFECTO
      sOptions += '<td style="display: none">' + $('#ddlCortado')[0].value + '</td>'; // ID_TOLERANCIA
      sOptions += '<td>' + $('#ddlCortado option:selected').text() + '</td>'; // TOLERANCIA
      sOptions += '<td>' + $('#AUDIT_CANTIDAD').val() + '</td>'; // CANTIDAD
      sOptions += '<td style="display: none">' + ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src) + '</td>';
      sOptions += '</tr>';
      $('#tlbCorteAuditoria').html();
      $('#tlbCorteAuditoria').html('<tbody id="bdyCorteAuditoria">' + sOptions + '</tbody>');
      // tslint:disable-next-line:max-line-length
      $('#tlbCorteAuditoria').append('<thead><tr><th>No.</th><th style="display: none"></th><th>#Cortador</th><th>Serie</th><th>No. Bulto</th><th style="display:none"></th><th>Posición</th><th style="display:none"></th><th>Defecto</th><th style="display:none"></th><th>+/-</th><th>Cantidad</th><th style="display: none"></th></tr></thead>');
      $('#tlbCorteAuditoria').DataTable({
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
      this.DisposeNewRowCortador();
    }
  }

  GetOrdenTrabajo(): boolean {
    console.log('GetOrdenTrabajo');
    console.log(Globals.UriRioSulApi + 'AuditoriaCorte/ObtieneOrdenesTrabajoDynamics?IdClienteRef=' +
      $('#ddlCliente').val() + '&OrdenT=' + $('#ddlOT').val());
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

  GetAuditoriaCorte() {
    let sOptions = '';
    let _index_ = 1;
    $.ajax({
      url: Globals.UriRioSulApi + 'AuditoriaCorte/ObtieneAuditoriaCorte',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        console.log(json);
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
            if (json.RES[i].FechaRegistroFin === null) {
              // tslint:disable-next-line:max-line-length
              sOptions += '<td><a onclick="SetId(' + json.RES[i].IdAuditoria + ')" class="waves-effect waves-green btn-flat modal-trigger" data-target="modalCloseAuditoria"><strong><u>Cerrar</u></strong></a></td>';
            } else {
              sOptions += '<td style="text-align: center">Cerrada</td>';
            }
            sOptions += '</tr>';
            _index_++;
          }
          $('#tlbAuditoriaCorte').html('');
          $('#tlbAuditoriaCorte').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbAuditoriaCorte').append('<thead><th></th><th>No.</th><th>Cliente</th><th>Orden Trabajo</th><th>PO</th><th>Tela</th><th>Marca</th><th>NumCortada</th><th>Lavado</th><th>Estilo</th><th>Planta</th><th>Estatus</th></thead>');
          $('#tlbAuditoriaCorte').DataTable({
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

  CierraAuditoria() {
    let Mensaje = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'AuditoriaCorte/CierreAuditoria?IdAuditoria=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          Mensaje = '';
        } else {
          Mensaje = 'No se pudo realizar el cierre de la auditoria';
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    if (Mensaje === '') {
      this._toast.success('Se realizo correctamente el cierre de la auditoía de corte', '');
      $('#modalCloseAuditoria').modal('close');
      this.GetAuditoriaCorte();
    } else {
      this._toast.warning(Mensaje, '');
    }
  }

}
