import {ToastrService} from 'ngx-toastr';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';

export declare var $: any;
declare var M: any;
declare var jQuery: any;
import 'jquery';
import {SegundasService} from '../services/segundas/segundas.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-segundas',
  templateUrl: './segundas.component.html',
  styleUrls: ['./segundas.component.css']
})
export class SegundasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  segundas = [];

  formEdit: FormGroup;

  modalPorcentajes = document.querySelector('modalPorcentajes');

  constructor(private _toast: ToastrService,
              private _segundasService: SegundasService) {
  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        processing: 'Procesando...',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ elementos',
        info: '_START_ - _END_ de _TOTAL_ elementos',
        infoEmpty: 'Mostrando ningún elemento.',
        infoFiltered: '(filtrado _MAX_ elementos total)',
        infoPostFix: '',
        loadingRecords: 'Cargando registros...',
        zeroRecords: 'No se encontraron registros',
        emptyTable: 'No hay datos disponibles en la tabla',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último'
        },
      }
    };
    $('.tooltipped').tooltip();
    $('#modalSegundas').modal();
    $('#modalPorcentajes').modal();
    $('#modalPorcentajesEdt').modal();
    $('#lblModulo').text('Catálogo Segundas');
    this.GetSegundas();
    this.initFormGroupEdit();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroupEdit() {
    this.formEdit = new FormGroup({
      'IdSegunda': new FormControl(),
      'Porcentaje_Tela': new FormControl(),
      'Porcentaje_Corte': new FormControl(),
      'Porcentaje_Confeccion': new FormControl(),
      'Porcentaje_Lavanderia': new FormControl(),
      'Porcentaje_ProcesosEspeciales': new FormControl(),
      'Porcentaje_Terminado': new FormControl(),
      'Costo_Estilo': new FormControl(),
      'Costo_Segunda': new FormControl(),
    });
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
      },
      complete: function () {
        $('#SegPreloader').css('display', 'none');
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
    this._segundasService.updateSegunda(this.formEdit.value).subscribe(
      res => {
        if (res) {
          this._toast.success('Porcentajes actualizados con exito', '');
          this.GetSegundas();
          this.closeModalPorcentajes();
        } else {
          this._toast.warning('Error al actualizar', 'Exito');
        }
        console.log(res);
      },
      error => {
        console.log(error);
        this._toast.error('No se pudo establecer conexión con la base de datos', '');
      }
    );
  }

  closeModalPorcentajes() {
    this.initFormGroupEdit();
    $('#modalPorcentajes').modal('close');
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
      this._toast.warning('Se debe llenar el campo "Costo Segunda"', '');
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
    $('#Preloader').css('display', 'block');
    this._segundasService.listSegundas()
      .subscribe(
        (segundas: any) => {
          console.log(segundas);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.segundas = segundas;
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexión con la base de datos', '');
          $('#Preloader').css('display', 'none');
        },
        () => {
          $('#Preloader').css('display', 'none');
        }
      );
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

  editSegunda(segunda) {
    this.formEdit.patchValue(segunda);
    setTimeout(() => M.updateTextFields(), 100);
  }

}
