import { Component, OnInit } from '@angular/core';
import { Globals } from '../Globals';
declare var $: any;
declare var jQuery: any;
import 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.component.html',
  styleUrls: ['./plantas.component.css']
})
export class PlantasComponent implements OnInit {

  constructor(
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('#modalRelacionArea').modal();
    $('#lblModulo').text('Confección - Plantas');
    this.GetPlantasDynamics();
  }

  GetPlantasDynamics() {
    let sOptions = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Confeccion/ObtienePlantasDynamics',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          let Index = 1;
          for (let i = 0; i < json.Vst_Plantas.length; i++) {
            sOptions += '<tr>';
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="SetId(' + '&#39;' + json.Vst_Plantas[i].Planta + '&#39;' + ') " class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalRelacionArea" data-position="bottom" data-tooltip="Modifica la relación entre áreas y plantas"><i class="material-icons right">edit</i></a></td>';
            sOptions += '<td>' + Index + '</td>';
            sOptions += '<td>' + json.Vst_Plantas[i].Planta + '</td>';
            sOptions += '<td>' + json.Vst_Plantas[i].Descripcion + '</td>';
            sOptions += '</tr>';
            Index++;
          }
          $('#tlbPlanta').html('');
          $('#tlbPlanta').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbPlanta').append('<thead><th></th><th>No.</th><th>Planta</th><th>Descripción</th></thead>');
          $('#tlbPlanta').DataTable({
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
        console.log('No se pudo establecer conexión a la base de datos');
      }
    });
  }

}
