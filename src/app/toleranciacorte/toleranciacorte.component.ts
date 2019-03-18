import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-toleranciacorte',
  templateUrl: './toleranciacorte.component.html',
  styleUrls: ['./toleranciacorte.component.css']
})
export class ToleranciacorteComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('#modalNewTolerancia').modal();
    $('#modalEdtTolerancia').modal();
    $('.tooltipped').tooltip();
    $('#lblModulo').text('Corte - Tolerancia');
    this.ObtieneTolerancias();
  }

  ObtieneTolerancias() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ObtieneTolerancias',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let contador = 1;
          for (let index = 0; index < json.Tolerancias.length; index++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(' + json.Tolerancias[index].IdTolerancia + '); GetToleranciaById();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEdtTolerancia" data-position="bottom" data-tooltip="Muestra los detalles del registro seleccionado"><i class="material-icons right">search</i></a></td>';
            sOptions += '<td>' + contador + '</td>';
            sOptions += '<td>' + json.Tolerancias[index].Descripcion + '</td>';
            if (json.Tolerancias[index].ToleranciaPositiva) {
              sOptions += '<td>SI</td>';
            } else {
              sOptions += '<td>NO</td>';
            }
            if (json.Tolerancias[index].ToleranciaNegativa) {
              sOptions += '<td>SI</td>';
            } else {
              sOptions += '<td>NO</td>';
            }
            sOptions += '<td>' + json.Tolerancias[index].Numerador + '</td>';
            sOptions += '<td>' + json.Tolerancias[index].Denominador + '</td>';
            sOptions += '</tr>';
            contador++;
          }
          $('#tlbTolerancia').html('');
          $('#tlbTolerancia').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbTolerancia').append('<thead><th></th><th>No.</th><th>Descripción</th><th>Tolerancia (+)</th><th>Tolerancia (-)</th><th>Numerador</th><th>Denominador</th></thead>');
          $('#tlbTolerancia').DataTable({
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

  DisposeNewTolerancia() {
    $('#TOL_NUMERADOR').val('');
    $('#TOL_DENOMINADOR').val('');
    $('#TOL_DESCRIPCION').val('');
    $('#chkToleranciaNegativa').prop('checked', false);
    $('#chkToleranciaPositiva').prop('checked', false);
  }

  NewTolerancia() {
    let Mensaje = '';
    if ($('#TOL_NUMERADOR').val() === '') {
      this._toast.warning('Se debe ingresar el númerador de tolerancia', '');
      $('#TOL_NUMERADOR').focus();
    } else if ($('#TOL_DENOMINADOR').val() === '') {
      this._toast.warning('Se debe ingresar el denominador de tolerancia', '');
    } else {
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Cortadores/ValidaNuevaTolerancia?Descripcion=1&Numerador=' + $('#TOL_NUMERADOR').val() + '&Denominador=' + $('#TOL_DENOMINADOR').val() + '&ToleranciaPositiva=' + $('#chkToleranciaPositiva').prop('checked') + '&ToleranciaNegativa=' + $('#chkToleranciaNegativa').prop('checked'),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json) {
            $.ajax({
              url: Globals.UriRioSulApi + 'Cortadores/RegistraNuevaTolerancia',
              type: 'POST',
              contentType: 'application/json; charset=utf-8',
              async: false,
              data: JSON.stringify({
                'Denominador': $('#TOL_DENOMINADOR').val(),
                'Descripcion': $('#TOL_DESCRIPCION').val(),
                'Numerador': $('#TOL_NUMERADOR').val(),
                'ToleranciaNegativa': $('#chkToleranciaNegativa').prop('checked'),
                'ToleranciaPositiva': $('#chkToleranciaPositiva').prop('checked')
              }),
              success: function (jsonAlta) {
                if (jsonAlta.Message.IsSuccessStatusCode) {
                  Mensaje = '';
                } else {
                  Mensaje = 'No se pudo agregar correctamente la tolerancia';
                }
              },
              error: function () {
                console.log('No se pudo establecer coneción a la base de datos');
              }
            });
          } else {
            Mensaje = 'La combinación registrada ya se encuentra dada de alta';
          }
        },
        error: function () {
          console.log('No se pudo establecer coneción a la base de datos');
        }
      });
      if (Mensaje === '') {
        this._toast.success('Se agrego correctamente la combinación de la tolerancia', '');
        $('#modalNewTolerancia').modal('close');
      } else {
        this._toast.warning(Mensaje, '');
      }
    }
  }

}
