import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {forkJoin, Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProcesosEspecialesService} from '../services/procesos-especiales/procesos-especiales.service';
import {AuditoriaTerminadoService} from '../services/terminado/auditoria-terminado.service';
import {ToastrService} from 'ngx-toastr';
import {Globals} from '../Globals';
import {LavanderiaService} from '../services/lavanderia/lavanderia.service';

declare var M: any;
declare var $: any;

@Component({
  selector: 'app-auditoria-lavanderia',
  templateUrl: './auditoria-lavanderia.component.html',
  styleUrls: ['./auditoria-lavanderia.component.css']
})
export class AuditoriaLavanderiaComponent implements OnInit, OnDestroy, AfterViewInit {

  dtOptions = {
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
  private Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  displayedColumns: string[] = [
    'Cliente', 'Marca', 'PO', 'Corte', 'Fecha Inicio',
    'Fecha fin', 'Defectos', '2das', 'Status', 'Opciones'
  ];

  dataSource: MatTableDataSource<any>;

  totalDetalle = 0;

  // Encabezado auditoria
  ordenTrabajo = '';
  bloquearOT = false;
  otDetalle;

  // Opciones formulario
  posiciones = [];
  operaciones = [];
  defectos = [];
  Det = [];
  items = [];

  selectedFile;

  form: FormGroup;
  constructor(
    private _lavanderiaService: LavanderiaService,
    private _terminadoAuditoriaService: AuditoriaTerminadoService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    $('.tooltipped').tooltip();
    $('select').formSelect();
    $('#modalNewAuditoria').modal();
    this.GetClients();
    this.GetDefectos();
    this.GetOperaciones();
    this.GetPosicion();
    this.GetAuditoriaProcEsp();
    $('#lblModulo').text('Lavandería - Auditoría');

    const defectos$ = this._lavanderiaService.listDefectos('', '', 'True');
    const operaciones$ = this._lavanderiaService.listOperaciones('', '', 'True');
    const posiciones$ = this._lavanderiaService.listPosiciones('', '', 'True');

    forkJoin(defectos$, operaciones$, posiciones$)
      .subscribe(
        (res: Array<any>) => {
          console.log(res);
          this.defectos = res[0].Vst_ProcesosEspeciales;
          this.operaciones = res[1].Vst_ProcesosEspeciales;
          this.posiciones = res[2].Vst_ProcesosEspeciales;
          const elems = document.querySelectorAll('select');
          setTimeout(() => M.FormSelect.init(elems, {}), 500);
        }
      );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroup() {
    this.form = new FormGroup({
      // Detalle
      'Defecto': new FormControl('', [Validators.required]),
      'Operacion': new FormControl('', [Validators.required]),
      'Posicion': new FormControl('', [Validators.required]),
      'Cantidad': new FormControl('', [Validators.required]),
      'Imagen': new FormControl(),
      'Nota': new FormControl(),
      'Archivo': new FormControl(),
      'NombreArchivo': new FormControl(),
    });
  }

  cargarAuditorias() {
    const filtro = {
      Fecha_i: null,
      Fecha_f: null,
      IdCliente: null,
      Marca: null,
      PO: null,
      Corte: null,
      Planta: null,
      Estilo: null,
      Auditoria: 'Terminado'
    };
    console.log('FILTRO', filtro);
    // this._clientesService.busqueda(filtro).subscribe(
    //   (res: any) => {
    //     console.log(res);
    //     this.dataSource = new MatTableDataSource(res.Auditoria);
    //   }
    // );
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

  ValidateAddProcEspAuditoria() {
    if ($('#ddlCliente')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un cliente valido', '');
    } else if ($('#ddlOT').val() === '0') {
      this._toast.warning('Se debe seleccionar una orden de trabajo valida', '');
    } else if ($('#ddlDefecto')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una posición valida', '');
    } else if ($('#AUDIT_CANTIDAD')[0].value === '' || $('#AUDIT_CANTIDAD')[0].value <= 0) {
      this._toast.warning('Se debe ingresar una cantidad valida', '');
    } else if ($('#ddlOperacion')[0].value === '0') {
      this._toast.warning('Se debe seleccionar una operación valida', '');
    } else if ($('#ddlPosicion')[0].value === '0') {
      this._toast.warning('Se debe seleccionar un posición valida', '');
    } else if (this.GetOrdenTrabajo() === false) {
      this._toast.warning('Debe ingresar una orden de trabajo valida', '');
    } else {
      const tlb = $('#bdyProcEspAuditoria');
      let sOptions = '';
      let _iindex = 1;
      for (let j = 0; j < document.getElementById('bdyProcEspAuditoria').getElementsByTagName('tr').length; j++) {
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
      sOptions += '<td style="display: none;">' + $('#ddlPosicion')[0].value + '</td>';
      sOptions += '<td>' + $('#ddlPosicion option:selected').text() + '</td>';
      sOptions += '<td style="display: none;">' + $('#ddlOperacion')[0].value + '</td>';
      sOptions += '<td>' + $('#ddlOperacion option:selected').text() + '</td>';
      sOptions += '<td style="display: none;">' + $('#ddlDefecto')[0].value + '</td>';
      sOptions += '<td>' + $('#ddlDefecto option:selected').text() + '</td>';
      sOptions += '<td>' + $('#AUDIT_CANTIDAD').val() + '</td>';
      sOptions += '<td style="display: none">' + ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src) + '</td>';
      sOptions += '</tr>';
      $('#tlbProcEspAuditoria').html();
      $('#tlbProcEspAuditoria').html('<tbody id="bdyProcEspAuditoria">' + sOptions + '</tbody>');
      // tslint:disable-next-line:max-line-length
      $('#tlbProcEspAuditoria').append('<thead><tr><th>No.</th><th style="display:none"></th><th>Área</th><th style="display:none"></th><th>Operación</th><th style="display:none"></th><th>Defecto</th><th>Cantidad</th><th style="display: none"></th></tr></thead>');
      $('#tlbProcEspAuditoria').DataTable({
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
      this.DisposeNewProcesosEspeciales();
    }
  }

  GetDefectos() {
    const ddl = $('#ddlDefectos');
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtieneDefectoProseso',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlDefectos').empty();
          for (let i = 0; i < json.Vst_ProcesosEspeciales.length; i++) {
            if (i === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_ProcesosEspeciales[i].ID).text(json.Vst_ProcesosEspeciales[i].Nombre));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_ProcesosEspeciales[i].ID).text(json.Vst_ProcesosEspeciales[i].Nombre));
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

  GetOperaciones() {
    const ddl = $('#ddlOperaion');
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtieneOperacionProcesosEspeciales',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlOperaion').empty();
          for (let index = 0; index < json.Vst_ProcesosEspeciales.length; index++) {
            if (index === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_ProcesosEspeciales[index].ID).text(json.Vst_ProcesosEspeciales[index].Nombre));
            } else {
              // tslint:disable-next-line:max-line-length
              $(ddl).append($('<option></option>').attr('value', json.Vst_ProcesosEspeciales[index].ID).text(json.Vst_ProcesosEspeciales[index].Nombre));
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

  GetPosicion() {
    const ddl = $('#ddlPosicion');
    $.ajax({
      url: Globals.UriRioSulApi + 'ProcesosEspeciales/ObtienePosicion',
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#ddlPosicion').empty();
          for (let index = 0; index < json.Vst_ProcesosEspeciales.length; index++) {
            if (index === 0) {
              $(ddl).append($('<option disabled selected></option>').attr('value', '0').text('SELECCIONE...'));
              $(ddl).append($('<option></option>').attr('value', json.Vst_ProcesosEspeciales[index].ID).text(json.Vst_Confeccion[index].Nombre));
            } else {
              $(ddl).append($('<option></option>').attr('value', json.Vst_ProcesosEspeciales[index].ID).text(json.Vst_Confeccion[index].Nombre));
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

  DisposeNewProcesosEspeciales() {
    $('#ddlDefecto').val(0);
    $('#ddlDefecto').formSelect();
    $('#AUDIT_CANTIDAD').val('');
    $('#ddlPosicion').val(0);
    $('#ddlPosicion').formSelect();
    $('#ddlOperacion').val(0);
    $('#ddlOperacion').formSelect();
    $('#blah')[0].src = 'http://placehold.it/180';
  }

  ValidateSave() {
    if (document.getElementById('bdyProcEspAuditoria').getElementsByTagName('tr').length === 0) {
      this._toast.warning('Se debe agregar al menos un registro de cortador para realizar un cierre', '');
    } else {
      let Mensaje = '';
      const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
      $.ajax({
        url: Globals.UriRioSulApi + 'AuditoriaProcesosEspeciales/NuevaAuditoriaProcEsp',
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
        this._toast.success('Se agrego correctamente el cierre de auditoría de procesos especiales', '');
        $('#modalNewAuditoria').modal('close');
      } else {
        this._toast.warning(Mensaje, '');
      }
    }
  }

  GetAuditoriaProcEsp() {
    let sOptions = '';
    let _index_ = 1;
    $.ajax({
      url: Globals.UriRioSulApi + 'AuditoriaProcesosEspeciales/ObtieneAuditoriaProcEsp',
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
          $('#tlbAuditoriaProcEsp').html('');
          $('#tlbAuditoriaProcEsp').html('<tbody>' + sOptions + '</tbody>');
          // tslint:disable-next-line:max-line-length
          $('#tlbAuditoriaProcEsp').append('<thead><th></th><th>No.</th><th>Cliente</th><th>Orden Trabajo</th><th>PO</th><th>Tela</th><th>Marca</th><th>NumCortada</th><th>Lavado</th><th>Estilo</th><th>Planta</th></thead>');
          $('#tlbAuditoriaProcEsp').DataTable({
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

  reset() {
    this.Det = [];
    this.otDetalle = null;
    this.bloquearOT = false;
    this.ordenTrabajo = '';
    this.initFormGroup();
    setTimeout(() => this.form.enable(), 100);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.items = [];
      this.dtTrigger.next();
    });
    const elems = document.querySelectorAll('select');
    setTimeout(() => M.FormSelect.init(elems, {}), 500);
  }

  detalleOT(ot) {
    console.log(ot);
    this._terminadoAuditoriaService.getDetailOT(ot)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.StatusCode === 409) {
            this.otDetalle = null;
            this.reset();
            this._toast.warning(res.Message2, '');
          } else {
            this.otDetalle = res.OT;
          }
        }
      );
  }

  validaAgregaAuditoria() {
    console.log(this.form.invalid);
    console.log(this.ordenTrabajo);
    if (this.ordenTrabajo !== '' && !this.form.invalid) {
      this.bloquearOT = true;
      const detalle = this.form.value;
      const detalleItem = {
        'IdDefecto': detalle.Defecto.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdOperacion': detalle.Defecto.ID,
        'Revisado': false,
        'Compostura': detalle.Compostura,
        'cantidad': +detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      console.log(this.Det);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        this.items.push(this.form.value);
        console.log('ITEMS: ', this.items);
        this.form.reset();
        this.selectedFile = null;
        const elems = document.querySelectorAll('select');
        setTimeout(() => M.FormSelect.init(elems, {}), 500);
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    } else {
      this._toast.warning('Se debe seleccionar una orden de trabajo valida', '');
    }
  }

  eliminar(index) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.Det.splice(index, 1);
      this.items.splice(index, 1);
      this.dtTrigger.next();
    });
  }

  guardarAuditoria() {
    const detalle = JSON.stringify(this.Det);
    console.log(this.Det);
    if (this.Det.length > 0) {
      const data = {
        'IdClienteRef': +this.otDetalle.ID_Cliente,
        'OrdenTrabajo': this.ordenTrabajo,
        'PO': document.getElementById('lblPO').innerText,
        'Tela': document.getElementById('lblTela').innerText,
        'Marca': document.getElementById('lblMarca').innerText,
        'NumCortada': document.getElementById('lblNoCortada').innerText,
        'Lavado': document.getElementById('lblLavado').innerText,
        'Estilo': document.getElementById('lblEstilo').innerText,
        'Planta': document.getElementById('lblPlanta').innerText,
        'Ruta': document.getElementById('lblRuta').innerText,
        'IdUsuario': this.Json_Usuario.ID,
        'Det': this.Det
      };
      // this._lavanderiaService.createAuditoria(data)
      //   .subscribe(
      //     res => {
      //       this._toast.success('Se agrego correctamente auditoria terminado', '');
      //       console.log(res);
      //       const elem = document.querySelector('#modalNewAuditoria');
      //       const instance = M.Modal.getInstance(elem);
      //       instance.close();
      //       this.cargarAuditorias();
      //       this.reset();
      //     },
      //     error => this._toast.error('Error al conectar a la base de datos', '')
      //   );
    } else {
      this._toast.warning('La auditoría debe contener al menos un detalle', '');
    }
  }


  openModalDetalle(auditoria) {
    const modalDetalle = document.querySelector('#modal-detalle');
    M.Modal.init(modalDetalle);
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.open();
    this.totalDetalle = auditoria.total;

    // this._terminadoAuditoriaService.getAuditoriaDetail(auditoria.IdAuditoria, tipo)
    //   .subscribe((res: any) => {
    //     this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
    //     this.otDetalle = res.RES;
    //     console.log(res);
    //   });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  processFile(imageInput: any, nuevo: boolean, tipo) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {
      if (tipo === 'imagen') {
        this.form.get('Imagen').patchValue(event.target.result);
        this.selectedFile = event.target.result;
      } else if (tipo === 'archivo') {
        this.form.get('Archivo').patchValue(event.target.result);
      }
      // nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
    });

    reader.readAsDataURL(file);
  }
}
