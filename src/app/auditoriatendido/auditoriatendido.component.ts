import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Globals} from '../Globals';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material';
import * as M from 'materialize-css/dist/js/materialize';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CorteService} from '../services/corte/corte.service';
import {AuditoriaCorteService} from '../services/auditoria-corte/auditoria-corte.service';
import {forkJoin} from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-auditoriatendido',
  templateUrl: './auditoriatendido.component.html',
  styleUrls: ['./auditoriatendido.component.css']
})
export class AuditoriatendidoComponent implements OnInit {
  @ViewChild('modalNewAuditoria', {read: ElementRef}) modalAgregar: ElementRef;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Cortador', 'Serie', 'Bulto', 'Posicion', 'Defecto',
    'Tolerancia', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];
  items = [];
  Det = [];

  // Encabezado auditoria
  ordenTrabajo = '';
  bloquearOT = false;
  otValida = false;
  otDetalle;
  loading = false;

  // Catalogos
  cortadores = [];
  posiciones = [];
  defectos = [];
  tolerancias = [];
  series = [];
  bultos = [];

  selectedFile;

  form: FormGroup;

  constructor(
    private _corteService: CorteService,
    private _auditoriaCorteService: AuditoriaCorteService,
    private _toast: ToastrService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('select').formSelect();
    // this.GetSeries();
    // this.GetDefectosCortadores();
    // this.GetPosicionCortador();
    // this.GetTendido();
    // this.GetTipoTendido();
    // this.GetMesa();
    $('#lblModulo').text('Tendido - Auditoría');
    this.initFormGroup();
    this.obtenerCatalogos();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'Cortador': new FormControl(),
      'Serie': new FormControl(null, Validators.required),
      'Bulto': new FormControl(null, Validators.required),
      'Posicion': new FormControl(null, Validators.required),
      'Defecto': new FormControl(null, Validators.required),
      'Tolerancia': new FormControl(null, Validators.required),
      'Cantidad': new FormControl(null, Validators.required),
      'Nota': new FormControl(),
      'Imagen': new FormControl(),
      'Archivo': new FormControl(),
      'NombreArchivo': new FormControl()
    });

    this.form.get('Serie').valueChanges
      .subscribe(
        serie => {
          if (this.otValida) {
            this._auditoriaCorteService.getBultosByOTAndSerie(this.ordenTrabajo, serie.Series)
              .subscribe((res: any) => this.bultos = res.Bulto);
          }
        }
      );
  }

  obtenerCatalogos() {
    const cortadores$ = this._corteService.listCortadores('', '', 'True');
    const posiciones$ = this._corteService.listPosiciones('', '', 'True');
    const defectos$ = this._corteService.listDefectos('', '', 'True');
    const tolerancias$ = this._corteService.listTolerancias('', '', 'True');

    forkJoin(cortadores$, posiciones$, defectos$, tolerancias$)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.cortadores = res[0].Vst_Cortadores;
          this.posiciones = res[1].Vst_Cortadores;
          this.defectos = res[2].Vst_Cortadores;
          this.tolerancias = res[3].Tolerancias;
        }
      );

    this._auditoriaCorteService.getSeries(this.ordenTrabajo)
      .subscribe((res: any) => {
        if (res.Message.IsSuccessStatusCode) {
          this.series = res.Serie;
        }
      });
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
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
            } else {
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
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
            } else {
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
              $(ddl).append($('<option></option>').attr('value', json.Vst_Cortadores[i].ID).text(json.Vst_Cortadores[i].Descripcion));
            } else {
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
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => { // {1}
        const control = this.form.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }

    if (this.ordenTrabajo !== '') {
      this.bloquearOT = true;
      const detalle = this.form.value;
      const detalleItem = {
        'Serie': detalle.Serie.Series,
        'Bulto': detalle.Bulto.Bulto,
        'IdTendido': detalle.Posicion.ID,
        'IdMesa': detalle.Posicion.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': +detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      const {Cortador, Serie, Bulto, Posicion, Defecto, Tolerancia, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        cortador: Cortador.Nombre,
        serie: Serie.Series,
        bulto: Bulto.Series,
        posicion: Posicion.Nombre,
        defecto: Defecto.Nombre,
        tolerancia: Tolerancia,
        cantidad: Cantidad,
        nota: Nota,
        imagen: Imagen,
        archivo: Archivo
      };
      this.items.push(itemTable);
      this.dataSource = new MatTableDataSource(this.items);
      this.initFormGroup();
      this.selectedFile = null;
    } else {
      this._toast.warning('Debe seleccionar una OT valida');
      const element = this.renderer.selectRootElement('#ddlOT');
      setTimeout(() => element.focus(), 0);
    }
  }

  eliminar(index) {
    // this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.items);
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

  detalleOT(ot) {
    console.log(ot);
    this.loading = true;
    this._auditoriaCorteService.getDetalleOT(ot)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.StatusCode === 409) {
            this.otDetalle = null;
            this.otValida = false;
            this._toast.warning(res.Message2, '');
          } else {
            this.otDetalle = res.OT;
            this.otValida = true;
            this.obtenerSeries();
          }
        }, error1 => {
          console.log(error1);
        },
        () => {
          this.loading = false;
        }
      );
  }

  obtenerSeries() {
    this._auditoriaCorteService.getSeries(this.ordenTrabajo)
      .subscribe((res: any) => {
        if (res.Message.IsSuccessStatusCode) {
          this.series = res.Serie;
        }
      });
  }

  openModalAgregar() {
    console.log('Estoy en abrir');
    const options = {
      dismissible: true,
      startingTop: '-10%',
      onOpenStart: this.reset.bind(this),
      onCloseEnd: this.closeModalAgregar.bind(this),
    };
    M.Modal.init(this.modalAgregar.nativeElement, options);
    const modalAgregar = M.Modal.getInstance(this.modalAgregar.nativeElement);
    modalAgregar.open();
  }

  closeModalAgregar() {
    console.log('Estoy en cerrar');
    const modalAgregar = M.Modal.getInstance(this.modalAgregar.nativeElement);
    modalAgregar.destroy();
  }

  reset() {
    console.log('Estoy en reset');
    this.initFormGroup();
    this.items = [];
    this.otDetalle = null;
    this.bloquearOT = false;
    this.ordenTrabajo = '';
    this.dataSource = new MatTableDataSource();
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

    const mime = encoded.match(/data:image+\/([a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }

}
