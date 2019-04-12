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
import {ClientesService} from '../services/clientes/clientes.service';
import swal from 'sweetalert';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';

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
  displayedColumnsEdit: string[] = [
    'Posicion', 'Operacion', 'Defecto', 'Cantidad', 'Imagen', 'Nota', 'Archivo', 'Opciones'
  ];
  displayedColumnsDetalle: string[] = [
    'Posicion', 'Operacion', 'Defecto', 'Cantidad', 'Imagen', 'Nota', 'Archivo'];

  dataSource: MatTableDataSource<any>;
  dataSourceEdit: MatTableDataSource<any>;
  dataSourceDetalle: MatTableDataSource<any>;

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
  loading = false;
  modalAgregar = false;

  form: FormGroup;

  constructor(
    private domSanitizer: DomSanitizer,
    private _clientesService: ClientesService,
    private _lavanderiaService: LavanderiaService,
    private _terminadoAuditoriaService: AuditoriaTerminadoService,
    private _reporteService: ReportesService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.cargarAuditorias();
    $('.tooltipped').tooltip();
    $('select').formSelect();
    $('#modalNewAuditoria').modal();
    $('#modalEditAuditoria').modal();
    $('#lblModulo').text('Lavandería - Auditoría');

    const defectos$ = this._lavanderiaService.listDefectos('', '', 'True');
    const operaciones$ = this._lavanderiaService.listOperaciones('', '', 'True');
    const posiciones$ = this._lavanderiaService.listPosiciones('', '', 'True');

    forkJoin(defectos$, operaciones$, posiciones$)
      .subscribe(
        (res: Array<any>) => {
          console.log(res);
          this.defectos = res[0].Vst_Lavanderia;
          this.operaciones = res[1].Vst_Lavanderia;
          this.posiciones = res[2].Vst_Lavanderia;
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
      Auditoria: 'Lavanderia'
    };
    console.log('FILTRO', filtro);
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res.Auditoria);
      }
    );
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
    this.modalAgregar = false;
    this.Det = [];
    this.otDetalle = null;
    this.bloquearOT = false;
    this.ordenTrabajo = '';
    this.initFormGroup();
    this.selectedFile = null;
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
    this.loading = true;
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
        }, error1 => {
          console.log(error1);
        },
        () => {
          this.loading = false;
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
        'IdOperacion': detalle.Operacion.ID,
        'Cantidad': +detalle.Cantidad,
        'Aud_Imagen': detalle.Imagen,
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

  validaAgregaAuditoriaEdit() {
    console.log(this.form.value);
    console.log(this.ordenTrabajo);
    if (!this.form.invalid) {
      const detalle = this.form.value;
      const detalleItem = {
        'IdDefecto': detalle.Defecto.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdOperacion': detalle.Operacion.ID,
        'Cantidad': detalle.Cantidad,
        'Aud_Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      console.log(this.Det);
      const defecto = this.form.controls['Defecto'].value;
      const operacion = this.form.controls['Operacion'].value;
      const posicion = this.form.controls['Posicion'].value;
      const cantidad = this.form.controls['Cantidad'].value;
      const imagen = this.form.controls['Imagen'].value;
      const archivo = this.form.controls['Archivo'].value;
      console.log(this.form.value);
      const itemTable = {
        NombreDefecto: defecto.Nombre,
        NombreOperacion: operacion.Nombre,
        NombrePosicion: posicion.Nombre,
        Cantidad: cantidad,
        Aud_Imagen: imagen,
        Archivo: archivo,
        Nota: this.form.controls['Nota'].value
      };
      this.items.push(itemTable);
      this.dataSourceEdit = new MatTableDataSource(this.items);
      this.form.reset();
      this.selectedFile = null;
      const elems = document.querySelectorAll('select');
      setTimeout(() => M.FormSelect.init(elems, {}), 500);
    } else {
      this._toast.warning('Error en formulario', '');
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
      this._lavanderiaService.createAuditoria(data)
        .subscribe(
          res => {
            this._toast.success('Se agrego correctamente auditoria lavandería', '');
            console.log(res);
            const elem = document.querySelector('#modalNewAuditoria');
            const instance = M.Modal.getInstance(elem);
            instance.close();
            this.cargarAuditorias();
            this.reset();
          },
          error => this._toast.error('Error al conectar a la base de datos', '')
        );
    } else {
      this._toast.warning('La auditoría debe contener al menos un detalle', '');
    }
  }

  eliminarAuditoria(id) {
    console.log(id);
    swal({
      text: '¿Estas seguro de eliminar esta auditoria?',
      buttons: {
        cancel: {
          text: 'Cancelar',
          closeModal: true,
          value: false,
          visible: true
        },
        confirm: {
          text: 'Aceptar',
          value: true,
        }
      }
    })
      .then((willDelete) => {
        if (willDelete) {
          this._lavanderiaService.deleteAuditoria(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Response.IsSuccessStatusCode) {
                  this._toast.success('Auditoria eliminada con exito', '');
                  this.cargarAuditorias();
                } else {
                  this._toast.warning('Ups! Algo no salio bien', '');
                }
              },
              error => {
                console.log(error);
                this._toast.error('Error al conectar a la base de datos', '');
              }
            );
        }
      });
  }

  openModal(auditoria) {
    this._lavanderiaService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.otDetalle = res.RES;
        setTimeout(() => M.updateTextFields(), 100);
        if (this.otDetalle.FechaRegistroFin !== null) {
          this.form.disable();
        } else {
          this.form.enable();
        }
        console.log(res);
        this.items = res.RES_DET;
        this.dataSourceEdit = new MatTableDataSource(this.items);
        this.items.forEach(x => {
          x.Imagen = x.Aud_Imagen;
          this.Det.push(x);
        });
      });
  }

  eliminarEditar(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSourceEdit = new MatTableDataSource(this.items);
  }

  guardarAuditoriaEdit() {
    if (this.otDetalle.FechaRegistroFin !== null) {
      const elem = document.querySelector('#modalNewAuditoria');
      const instance = M.Modal.getInstance(elem);
      instance.close();
      this.cargarAuditorias();
      this.reset();
    } else {
      if (this.Det.length > 0) {
        const data = {
          IdAuditoria: this.otDetalle.IdAuditoria,
          Det: this.Det
        };
        this._lavanderiaService.updateAuditoria(data)
          .subscribe(
            (res: any) => {
              if (res.Response.StatusCode === 200) {
                this._toast.success('Se actualizo correctamente auditoria', '');
                console.log(res);
                const elem = document.querySelector('#modalEditAuditoria');
                const instance = M.Modal.getInstance(elem);
                instance.close();
                this.cargarAuditorias();
                this.reset();
              } else {
                this._toast.warning('Ups! Algo no salio bien', '');
              }
            },
            error => {
              console.log(error);
              this._toast.error('Error al conectar a la base de datos', '');
            }
          );
      } else {
        this._toast.warning('La auditoría debe contener al menos un detalle', '');
      }
    }
  }


  openModalDetalle(auditoria) {
    const modalDetalle = document.querySelector('#modal-detalle');
    M.Modal.init(modalDetalle);
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.open();
    this.totalDetalle = auditoria.total;

    this._lavanderiaService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  closeModalDetalle() {
    const modalDetalle = document.querySelector('#modal-detalle');
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.close();
  }

  cerrarAuditoria() {
    swal({
      text: '¿Estas seguro de cerrar esta auditoria?',
      buttons: {
        cancel: {
          text: 'Cancelar',
          closeModal: true,
          value: false,
          visible: true
        },
        confirm: {
          text: 'Aceptar',
          value: true,
        }
      }
    })
      .then((willDelete) => {
        if (willDelete) {
          this._lavanderiaService.cierreAuditoria(this.otDetalle.IdAuditoria)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res === null) {
                  this._toast.success('Auditoria cerrada con exito', '');
                  this.closeModal();
                  this.cargarAuditorias();
                } else {
                  this._toast.warning('Ups! Algo no salio bien', '');
                }
              },
              error => {
                console.log(error);
                this._toast.error('Error al conectar a la base de datos', '');
              }
            );
        }
      });
  }

  closeModal() {
    const elem = document.querySelector('#modalEditAuditoria');
    const instance = M.Modal.getInstance(elem);
    this.Det = [];
    this.items = [];
    this.initFormGroup();
    instance.close();
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

  openPdfInTab(archivo) {
    const base64ImageData = archivo;
    // let extension = this.base64MimeType(archivo);
    // console.log(extension);
    // data:application/pdf
    const contentType = `application/pdf`;

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  openImage(imagen) {
    const base64ImageData = imagen;
    const extension = this.base64MimeType(imagen);
    console.log(extension);
    const contentType = `image/${extension}`;

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  base64MimeType(encoded) {
    let result = null;

    if (typeof encoded !== 'string') {
      return result;
    }

    let mime = encoded.match(/data:image+\/([a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Lavanderia')
      .subscribe(
        imprimirResp => {
          console.log('RESULTADO IMPRIMIR RECIB0: ', imprimirResp);
          const pdfResult: any = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imprimirResp)
          );
          // printJS(pdfResult.changingThisBreaksApplicationSecurity);
          window.open(pdfResult.changingThisBreaksApplicationSecurity);
          console.log(pdfResult);
        });
  }

  getTotalDetalle() {
    return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
  }
}
