import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
export declare var $: any;
declare var jQuery: any;
import 'jquery';

@Component({
  selector: 'app-segundas',
  templateUrl: './segundas.component.html',
  styleUrls: ['./segundas.component.css']
})
export class SegundasComponent implements OnInit {

  constructor(private _toast: ToastrService) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalSegundas').modal();
    $('#modalPorcentajes').modal();
    $('#modalPorcentajesEdt').modal();
    $('#lblModulo').text('Catálogo Segundas');
    this.GetSegundas();
  }

  GetSegundasDynamic() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'CatalogoSegundas/ObtieneSegundasDynamics?Key=' + atob(Globals.PasswordKey),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: true,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let _Index = 1;
          for (let i = 0; i < json.estilos.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="javascript: SetId(\'' + json.estilos[i].estilo + '|' + json.estilos[i].des_estilo + '\'); DisposeCatSegundas();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalPorcentajes" data-position="bottom" data-tooltip="Agrega porcentajes de segundas al estilo"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + _Index + '</td>';
            sOptions += '<td>' + json.estilos[i].estilo + '</td>';
            sOptions += '<td>' + json.estilos[i].des_estilo + '</td>';
            sOptions += '</tr>';
            _Index++;
          }
          $('#tlbSegundasDynamic').html('');
          // tslint:disable-next-line:max-line-length
          $('#tlbSegundasDynamic').html('<thead><th></th><th>No.</th><th>Estilo</th><th>Descripcion</th></thead><tbody>' + sOptions + '</tbody>');
          $('#tlbSegundasDynamic').DataTable({
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
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
  }

  ValidateEditSegunda() {
    if ($('#SEG_EDT_TELA').val() === '') {
      this._toast.warning('Se debe llenar el campo "Tela"', '');
    } else if ($('#SEG_EDT_CORTE').val() === '') {
      this._toast.warning('Se debe llenar el campo "Corte"', '');
    } else if ($('#SEG_EDT_CONFECCION').val() === '') {
      this._toast.warning('Se debe llenar el campo "Confección"', '');
    } else if ($('#SEG_EDT_LAVANDERIA').val() === '') {
      this._toast.warning('Se debe llenar el campo "Confección"', '');
    } else if ($('#SEG_EDT_PROC_ESP').val() === '') {
      this._toast.warning('Se debe llenar el campo "Confección"', '');
    } else if ($('#SEG_EDT_TERMINADO').val() === '') {
      this._toast.warning('Se debe llenar el campo "Terminado"', '');
    } else if ($('#SEG_EDT_COSTO_ESTILO').val() === '' || $('#SEG_COSTO_ESTILO').val() === '0') {
      this._toast.warning('Se debe llenar el campo "Costo Estilo"', '');
    } else if ($('#SEG_EDT_SEGUNDA').val() === '' || $('#SEG_EDT_SEGUNDA').val() === '0') {
      this._toast.warning('Se debe llenar el campo "Costo Estilo"', '');
    } else {
      this.UpdateSegunda();
    }
  }

  UpdateSegunda() {
    $.ajax({
      url: Globals.UriRioSulApi + 'CatalogoSegundas/EditaSegundaPorcentajes',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        'IdSegunda': $('#HDN_ID').val(),
        'Porcentaje_Tela': $('#SEG_TELA').val(),
        'Porcentaje_Corte': $('#SEG_CORTE').val(),
        'Porcentaje_Confeccion': $('#SEG_CONFECCION').val(),
        'Porcentaje_Lavanderia': $('#SEG_LAVANDERIA').val(),
        'Porcentaje_ProcesosEspeciales': $('#SEG_PROC_ESP').val(),
        'Porcentaje_Terminado': $('#SEG_TERMINADO').val(),
        'Costo_Estilo': $('#SEG_COSTO_ESTILO').val(),
        'Costo_Segunda': $('#SEG_SEGUNDA').val()
      })
    });
  }

  ValidateAddSegunda() {
    const hdnArr = $('#HDN_ID').val().split('|');
    if ($('#SEG_TELA').val() === '') {
      this._toast.warning('Se debe llenar el campo "Tela"', '');
    } else if ($('#SEG_CORTE').val() === '') {
      this._toast.warning('Se debe llenar el campo "Corte"', '');
    } else if ($('#SEG_CONFECCION').val() === '') {
      this._toast.warning('Se debe llenar el campo "Confección"', '');
    } else if ($('#SEG_LAVANDERIA').val() === '') {
      this._toast.warning('Se debe llenar el campo "Confección"', '');
    } else if ($('#SEG_PROC_ESP').val() === '') {
      this._toast.warning('Se debe llenar el campo "Confección"', '');
    } else if ($('#SEG_TERMINADO').val() === '') {
      this._toast.warning('Se debe llenar el campo "Terminado"', '');
    } else if ($('#SEG_COSTO_ESTILO').val() === '' || $('#SEG_COSTO_ESTILO').val() === '0') {
      this._toast.warning('Se debe llenar el campo "Costo Estilo"', '');
    } else if ($('#SEG_SEGUNDA').val() === '' || $('#SEG_SEGUNDA').val() === '0') {
      this._toast.warning('Se debe llenar el campo "Costo Estilo"', '');
    } else {
      if (this.ValidateEstilo(hdnArr[0], hdnArr[1])) {
        this.SaveSegunda(hdnArr[0], hdnArr[1]);
      } else {
        this._toast.warning('El estilo y descripción ya se encuentra registrada con porcentajes de segundas', '');
      }
    }
  }

  SaveSegunda(estilo, Descripcion) {
    let Mensaje = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'CatalogoSegundas/GuardaSegundaPorcentajes',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        'Estilo': estilo,
        'Descripcion': Descripcion,
        'Porcentaje_Tela': $('#SEG_TELA').val(),
        'Porcentaje_Corte': $('#SEG_CORTE').val(),
        'Porcentaje_Confeccion': $('#SEG_CONFECCION').val(),
        'Porcentaje_Lavanderia': $('#SEG_LAVANDERIA').val(),
        'Porcentaje_ProcesosEspeciales': $('#SEG_PROC_ESP').val(),
        'Porcentaje_Terminado': $('#SEG_TERMINADO').val(),
        'Costo_Estilo': $('#SEG_COSTO_ESTILO').val(),
        'Costo_Segunda': $('#SEG_SEGUNDA').val()
      }),
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalPorcentajes').modal('close');
          Mensaje = 'Se agrego correctamente los porcentajes de segunda';
        }
      },
      error: function () {
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
    if (Mensaje !== '') {
      this._toast.success(Mensaje, '');
    }
  }

  GetSegundas() {
    $('#tlbsegundas').html('');
    $('#SegPreloader').css('display', 'block');
    const request = ($('#BUSQUEDA_SEG').val() === '' ? '' : '?Busqueda=' + $('#BUSQUEDA_SEG').val());
    let sOptions = '';
    // if ($('#BUSQUEDA_SEG').val() !== '') {
      $.ajax({
        url: Globals.UriRioSulApi + 'CatalogoSegundas/ObtieneEstilosApp' + request,
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json !== '' && json !== null) {
            let index = 1;
            for (let i = 0; i < json.length; i++) {
              sOptions += '<tr>';
              // tslint:disable-next-line:max-line-length
              sOptions += '<td><a onclick="javascript: SetId(' + json[i].IdSegunda + '); DisposeCatSegundas();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalPorcentajes" data-position="bottom" data-tooltip="Agrega porcentajes de segundas al estilo"><i class="material-icons right">edit</i></a></td>';
              sOptions += '<td>' + index + '</td>';
              sOptions += '<td>' + json[i].Estilo + '</td>';
              sOptions += '<td>' + json[i].Descripcion + '</td>';
              sOptions += '<td>' + json[i].Porcentaje_Tela + '</td>';
              sOptions += '<td>' + json[i].Porcentaje_Corte + '</td>';
              sOptions += '<td>' + json[i].Porcentaje_Confeccion + '</td>';
              sOptions += '<td>' + json[i].Porcentaje_Lavanderia + '</td>';
              sOptions += '<td>' + json[i].Porcentaje_ProcesosEspeciales + '</td>';
              sOptions += '<td>' + json[i].Porcentaje_Terminado + '</td>';
              sOptions += '<td>' + json[i].Costo_Segunda + '</td>';
              sOptions += '<td>' + json[i].Costo_Estilo + '</td>';
              sOptions += '</tr>';
              index++;
            }
            $('#tlbsegundas').html('');
            // tslint:disable-next-line:max-line-length
            $('#tlbsegundas').html('<thead><tr><th></th><th>No.</th><th>Estilo</th><th>Descripcion</th><th>Tela</th><th>Corte</th><th>Confección</th><th>Lavandería</th><th>Procesos Esp.</th><th>Terminado</th><th>Costo Estilo</th><th>Costo Segundas</th></tr></thead><tbody>' + sOptions + '</tbody>');
            $('#tlbsegundas').DataTable({
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
        complete: function () {
          $('#SegPreloader').css('display', 'none');
        },
        error: function () {
          console.log('No se pudo establecer conexión con la base de datos');
        }
      });
    // } else {
    //   this._toast.warning('Debes ingresar un filtro de búsqueda', '');
    // }
  }

  ValidateEstilo(Estilo: string, Descripcion: string): boolean {
    let Result = false;
    $.ajax({
      url: Globals.UriRioSulApi + 'CatalogoSegundas/VerificaEstilo?Estilo=' + Estilo + '&Descripcion=' + Descripcion,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json) {
          Result = true;
        } else {
          Result = false;
        }
      },
      error: function () {
        console.log('No se pudo establecer conexión con la base de datos');
        Result = false;
      }
    });
    return Result;
  }

}
