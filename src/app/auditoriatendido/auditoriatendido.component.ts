import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-auditoriatendido',
  templateUrl: './auditoriatendido.component.html',
  styleUrls: ['./auditoriatendido.component.css']
})
export class AuditoriatendidoComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewAuditoria').modal();
    $('select').formSelect();
    this.GetSeries();
    this.GetDefectosCortadores();
    this.GetPosicionCortador();
    this.GetTendido();
    this.GetTipoTendido();
    this.GetMesa();
    $('#lblModulo').text('Tendido - Auditoría');
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
        // $('#ddlCliente').empty();
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

  ValidateSave() {
    if (document.getElementById('bdyCorteAuditoria').getElementsByTagName('tr').length === 0) {
      this._toast.warning('Se debe agregar al menos un registro de cortador para realizar un cierre', '');
    } else {
      let Mensaje = '';
      const bdy = $('#bdyCorteAuditoria');
      const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
      $.ajax({
        url: Globals.UriRioSulApi + 'AuditoriaCorte/NuevaAuditoriaCorteTendido',
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
        this._toast.success('Se agrego correctamente el cierre de auditoría de tendido', '');
        $('#modalNewAuditoria').modal('close');
      } else {
        this._toast.warning(Mensaje, '');
      }
    }
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

  GetTendido() {
    const ddl = $('#ddlTendido');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneTendido',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlTendido').empty();
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text( json.Vst_Cortadores[i].Descripcion));
            } else {
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

  GetTipoTendido() {
    const ddl = $('#ddlTipoTendido');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneTipoTendido',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlTipoTendido').empty();
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text( json.Vst_Cortadores[i].Descripcion));
            } else {
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

  GetMesa() {
    const ddl = $('#ddlMesa');
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneMesa',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlMesa').empty();
          for (let i = 0; i < json.Vst_Cortadores.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text( json.Vst_Cortadores[i].Descripcion));
            } else {
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
    $('#ddlMesa').val(0);
    $('#ddlMesa').formSelect();
    $('#ddlTipoTendido').val(0);
    $('#ddlTipoTendido').formSelect();
    $('#ddlTendido').val(0);
    $('#ddlTendido').formSelect();
    $('#AUDIT_CANTIDAD').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

  GetAuditoriaTendido() {
    let sOptions = '';
    let _iindex = 1;
    $.ajax({
      url: Globals.UriRioSulApi + 'AuditoriaCorte/ObtieneAuditoriaTendido',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          for (let i = 0; i < json.RES.length; i++) {
            sOptions += '<tr>';
            sOptions += '<td></td>';
            sOptions += '<td>' + _iindex + '</td>';
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
            _iindex++;
          }
          $('#tlbAuditoriaCorte').html('');
          $('#tlbAuditoriaCorte').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbAuditoriaCorte').append('<thead><th></th><th>No.</th><th>Cliente</th><th>Orden Trabajo</th><th>PO</th><th>Tela</th><th>Marca</th><th>NumCortada</th><th>Lavado</th><th>Estilo</th><th>Planta</th></thead>');
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

  ValidateAddTendidoAuditoria() {
    /*if ($('#ddlCliente')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un cliente valido', '');
    } else*/ if ($('#ddlOT').val() === '0' ) {
      this._toast.warning('Se debe seleccionar una orden de trabajo valida', '');
    } else if ($('#ddlSerie')[0].value === '0') {
      this._toast.warning('Se debe serleccionar una serie valida', '');
    // } else if ($('#ddlNoBulto')[0].value === '0') {
    //   this._toast.warning('Se debe seleccionar un número de bulto valido', '');
    } else if ($('#ddlPosicion')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una posición valida', '');
    } else if ($('#ddlDefecto')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una posición valida', '');
    } else if ($('#ddlTendido')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un tendido valido', '');
    } else if ($('#ddlTipoTendido')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un tipo de tendido valido', '');
    } else if ($('#ddlMesa')[0].value === '0' ) {
      this._toast.warning('Se debe seleccionar una mesa valida', '');
    } else if ($('#AUDIT_CANTIDAD')[0].value === '' || $('#AUDIT_CANTIDAD')[0].value <= 0) {
      this._toast.warning('Se debe ingresar una cantidad valida', '');
    } /*else if (this.GetOrdenTrabajo() === false ) {
      this._toast.warning('Se debe ingresar una orden de trabajo valida', '');
    }*/ else {
      const tlb = $('#bdyCorteAuditoria');
      let sOptions = '';
      let _iindex = 1;
      for (let j = 0; j < document.getElementById('bdyCorteAuditoria').getElementsByTagName('tr').length; j++) {
        sOptions += '<tr>';
        sOptions += '<td>' + _iindex + '</td>'; // NO
        sOptions += '<td>' + tlb[0].rows[j].cells[1].innerText + '</td>'; // Serie
        sOptions += '<td>' + tlb[0].rows[j].cells[2].innerText + '</td>'; // No Bulto
        sOptions += '<td style="display: none">' + tlb[0].rows[j].cells[3].innerText + '</td>'; // ID TENDIDO
        sOptions += '<td>' + tlb[0].rows[j].cells[4].innerText + '</td>'; // TENDIDO
        sOptions += '<td style="display: none">' + tlb[0].rows[j].cells[5].innerText + '</td>'; // ID TIPO TENDIDO
        sOptions += '<td>' + tlb[0].rows[j].cells[6].innerText + '</td>'; // TENDIDO
        sOptions += '<td style="display: none">' + tlb[0].rows[j].cells[7].innerText + '</td>'; // ID POSICION
        sOptions += '<td>' + tlb[0].rows[j].cells[8].innerText + '</td>'; // POSICION
        sOptions += '<td style="display: none">' + tlb[0].rows[j].cells[9].innerText + '</td>'; // ID DEFECTO
        sOptions += '<td>' + tlb[0].rows[j].cells[10].innerText + '</td>'; // DEFECTO
        sOptions += '<td style="display: none">' + tlb[0].rows[j].cells[11].innerText + '</td>'; // ID MESA
        sOptions += '<td>' + tlb[0].rows[j].cells[12].innerText + '</td>'; // MESA
        sOptions += '<td>' + tlb[0].rows[j].cells[13].innerText + '</td>'; // CANTIDAD
        sOptions += '<td style="display:none">' + tlb[0].rows[j].cells[14].innerText + '</td>'; // IMAGEN
        sOptions += '</tr>';
        _iindex++;
      }
      sOptions += '<tr>';
      sOptions += '<td>' + _iindex + '</td>'; // NO
      sOptions += '<td>' + $('#ddlSerie option:selected').text() + '</td>'; // Serie
      sOptions += '<td>' + $('#ddlNoBulto option:selected').text() + '</td>'; // No Bulto
      sOptions += '<td style="display: none">' + $('#ddlTendido')[0].value + '</td>'; // ID TENDIDO
      sOptions += '<td>' + $('#ddlTendido option:selected').text() + '</td>'; // TENDIDO
      sOptions += '<td style="display: none">' + $('#ddlTipoTendido')[0].value + '</td>'; // ID TIPO TENDIDO
      sOptions += '<td>' + $('#ddlTipoTendido option:selected').text() + '</td>'; // TIPO TENDIDO
      sOptions += '<td style="display: none">' + $('#ddlPosicion')[0].value + '</td>'; // ID POSICION
      sOptions += '<td>' + $('#ddlPosicion option:selected').text() + '</td>'; // POSICION
      sOptions += '<td style="display: none">' + $('#ddlDefecto')[0].value + '</td>'; // ID DEFECTO
      sOptions += '<td>' + $('#ddlDefecto option:selected').text() + '</td>'; // DEFECTO
      sOptions += '<td style="display: none">' + $('#ddlMesa')[0].value + '</td>'; // ID MESA
      sOptions += '<td>' + $('#ddlMesa option:selected').text() + '</td>'; // MESA
      sOptions += '<td>' + $('#AUDIT_CANTIDAD').val() + '</td>'; // CANTIDAD
      // tslint:disable-next-line:max-line-length
      sOptions += '<td style="display:none">' +  ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src) + + '</td>'; // IMAGEN
      sOptions += '</tr>';

      $('#tlbCorteAuditoria').html();
      $('#tlbCorteAuditoria').html('<tbody id="bdyCorteAuditoria">' + sOptions + '</tbody>');
      // tslint:disable-next-line:max-line-length
      $('#tlbCorteAuditoria').append('<thead><th>No.</th><th>Serie</th><th>No. Bulto</th><th style="display: none"></th><th>Tendido</th><th style="display: none"></th><th>Tipo Tendido</th><th style="display: none"></th><th>Posición</th><th style="display: none"></th><th>Defecto</th><th style="display: none"></th><th>Mesa</th><th>Cantidad</th><th style="display: none"></th></thead>');
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
