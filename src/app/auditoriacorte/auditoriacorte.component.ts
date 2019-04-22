import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Globals} from '../Globals';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {CorteService} from '../services/corte/corte.service';
import {forkJoin} from 'rxjs';
import {AuditoriaCorteService} from '../services/auditoria-corte/auditoria-corte.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {ClientesService} from '../services/clientes/clientes.service';
import {DomSanitizer} from '@angular/platform-browser';
import swal from 'sweetalert';
import {ReportesService} from '../services/reportes/reportes.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-auditoriacorte',
  templateUrl: './auditoriacorte.component.html',
  styleUrls: ['./auditoriacorte.component.css']
})

export class AuditoriacorteComponent implements OnInit {
  @ViewChild('modalNewAuditoria', {read: ElementRef}) modalAgregar: ElementRef;
  @ViewChild('modalDetalle', {read: ElementRef}) modalDetalle: ElementRef;
  @ViewChild('modalEdit', {read: ElementRef}) modalEdit: ElementRef;

  private json_usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Cortadas', 'Fecha Inicio',
    'Fecha fin', 'Defectos', '2das', 'Status', 'Opciones'
  ];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Serie', 'Bulto', 'Tendido', 'Tipo Tendido', 'Mesa', 'Posicion',
    'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];
  dataSourceEdit: MatTableDataSource<any>;
  displayedColumnsEdit: string[] = [
    'Serie', 'Bulto', 'Tendido', 'Tipo Tendido', 'Mesa', 'Posicion',
    'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];
  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Serie', 'Bulto', 'Tendido', 'TipoTendido', 'Mesa', 'Posicion', 'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo'];

  items = [];
  Det = [];
  optionModule = [
    {value: 1, viewValue: 'Automático'},
    {value: 2, viewValue: 'Manual'},
    {value: 3, viewValue: 'Ambos'}
  ];

  // Encabezado auditoria
  ordenTrabajo = '';
  bloquearOT = false;
  otValida = false;
  otDetalle;

  tendidos = [];
  posiciones = [];
  defectos = [];
  mesas = [];
  series = [];
  bultos = [];

  loading = false;
  selectedFile;

  form: FormGroup;
  valueChangesSerie$;

  constructor(
    private _reporteService: ReportesService,
    private _clientesService: ClientesService,
    private _auditoriaCorteService: AuditoriaCorteService,
    private _corteService: CorteService,
    private _toast: ToastrService,
    private renderer: Renderer2,
    private domSanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    $('#lblModulo').text('Corte - Auditoría');
    $('.tooltipped').tooltip();
    // $('#modalCloseAuditoria').modal();
    $('select').formSelect();
    this.initFormGroup();
    this.obtenerCatalogos();
    this.obtenerAuditorias();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'IdCortador': new FormControl(),
      'Serie': new FormControl(null, Validators.required),
      'Bulto': new FormControl(null, Validators.required),
      'Tendido': new FormControl(null, Validators.required),
      'Mesa': new FormControl(null, Validators.required),
      'Posicion': new FormControl(null, Validators.required),
      'Defecto': new FormControl(null, Validators.required),
      'Cantidad': new FormControl(null, Validators.required),
      'Nota': new FormControl(),
      'Imagen': new FormControl(),
      'Archivo': new FormControl(),
      'NombreArchivo': new FormControl()
    });

    this.valueChangesSerie$ = this.form.get('Serie').valueChanges
      .subscribe(
        serie => {
          if (serie) {
            if (this.otValida) {
              console.log(serie);
              this._auditoriaCorteService.getBultosByOTAndSerie(this.ordenTrabajo, serie.Series)
                .subscribe((bultos: any) => this.bultos = bultos.Bulto);
            }
          }
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

  obtenerCatalogos() {
    const tendidos$ = this._corteService.listTendidos('', '', 'True');
    const posiciones$ = this._corteService.listPosiciones('', '', 'True');
    const defectos$ = this._corteService.listDefectos('', '', 'True');
    const mesas$ = this._corteService.listMesas('', '', 'True');

    forkJoin(tendidos$, posiciones$, defectos$, mesas$)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.tendidos = res[0].Vst_Cortadores;
          this.posiciones = res[1].Vst_Cortadores;
          this.defectos = res[2].Vst_Cortadores;
          this.mesas = res[3].Vst_Cortadores;
        }
      );
  }

  guardarAuditoria() {
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
        'IdUsuario': this.json_usuario.ID,
        'Det': this.Det
      };
      this._auditoriaCorteService.createAuditoria(data)
        .subscribe(
          res => {
            this._toast.success('Se agrego correctamente auditoria', '');
            console.log(res);
            this.closeModalAgregar();
            this.obtenerAuditorias();
            this.reset();
          },
          error => this._toast.error('Error al conectar a la base de datos', '')
        );
    } else {
      this._toast.warning('La auditoría debe contener al menos un detalle', '');
    }
  }

  guardarAuditoriaEdit() {
    if (this.Det.length > 0) {
      const data = {
        IdAuditoria: this.otDetalle.IdAuditoria,
        Det: this.Det
      };
      this._auditoriaCorteService.updateAuditoria(data)
        .subscribe(
          res => {
            this._toast.success('Se actualizo correctamente auditoria', '');
            console.log(res);
            this.closeModalEditar();
            this.obtenerAuditorias();
          },
          error => this._toast.error('Error al conectar a la base de datos', '')
        );
    } else {
      this._toast.warning('La auditoría debe contener al menos un detalle', '');
    }
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

  openModalDetalle(auditoria) {
    console.log('Estoy en abrir');
    const options = {
      dismissible: true,
      startingTop: '-10%',
      onOpenStart: this.reset.bind(this),
      onCloseEnd: this.closeModalDetalle.bind(this),
    };
    M.Modal.init(this.modalDetalle.nativeElement, options);
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.open();

    // this.totalDetalle = auditoria.total;

    this._auditoriaCorteService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        res.RES_DET.forEach(
          x => {
            if (x.TipoTendido === 1) {
              x.tipo_tendido = 'Automatico';
            } else if (x.TipoTendido === 2) {
              x.tipo_tendido = 'Manual';
            } else {
              x.tipo_tendido = 'Ambos';
            }
          }
        );
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  closeModalDetalle() {
    console.log('Estoy en cerrar');
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.destroy();
  }

  openModalEditar(auditoria) {
    console.log('Estoy en abrir');
    const options = {
      dismissible: true,
      startingTop: '-10%',
      onOpenStart: this.reset.bind(this),
      onCloseEnd: this.closeModalEditar.bind(this),
    };
    M.Modal.init(this.modalEdit.nativeElement, options);
    const modalEdit = M.Modal.getInstance(this.modalEdit.nativeElement);
    modalEdit.open();
    this._auditoriaCorteService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
          this.otDetalle = res.RES;
          this.otValida = true;
          this.ordenTrabajo = this.otDetalle.OrdenTrabajo;
          this.obtenerSeries();
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
            if (x.TipoTendido === 1) {
              x.tipo_tendido = 'Automatico';
            } else if (x.TipoTendido === 2) {
              x.tipo_tendido = 'Manual';
            } else {
              x.tipo_tendido = 'Ambos';
            }
            this.Det.push(x);
          });
        },
        error => {
          console.log(error);
        },
        () => {
        });
  }

  closeModalEditar() {
    console.log('Estoy en cerrar');
    const modalEdit = M.Modal.getInstance(this.modalEdit.nativeElement);
    modalEdit.destroy();
    this.valueChangesSerie$.unsubscribe();
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Corte')
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
          this._auditoriaCorteService.cierreAuditoria(this.otDetalle.IdAuditoria)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res === null) {
                  this._toast.success('Auditoria cerrada con exito', '');
                  this.closeModalEditar();
                  this.obtenerAuditorias();
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
          this._auditoriaCorteService.deleteAuditoria(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Response.IsSuccessStatusCode) {
                  this._toast.success('Auditoria eliminada con exito', '');
                  this.obtenerAuditorias();
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

  reset() {
    console.log('Estoy en reset');
    this.initFormGroup();
    this.Det = [];
    this.items = [];
    this.otDetalle = null;
    this.bloquearOT = false;
    this.otValida = false;
    this.ordenTrabajo = '';
    this.dataSource = new MatTableDataSource();
  }

  ValidateAddCortadorAuditoria() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => { // {1}
        const control = this.form.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    if (this.ordenTrabajo !== '' && this.otValida) {
      this.bloquearOT = true;
      const detalle = this.form.value;
      console.log('DETALLE: ', detalle);
      const detalleItem = {
        'Serie': detalle.Serie.Series,
        'Bulto': detalle.Bulto.Bulto,
        'IdTendido': detalle.Tendido.ID,
        'IdMesa': detalle.Mesa.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': +detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      const {Serie, Bulto, Tendido, Mesa, Posicion, Defecto, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        serie: Serie.Series,
        bulto: Bulto.Bulto,
        tendido: Tendido.Nombre,
        tipo_tendido: Tendido.TipoTendido,
        mesa: Mesa.Nombre,
        posicion: Posicion.Nombre,
        defecto: Defecto.Nombre,
        cantidad: Cantidad,
        nota: Nota,
        imagen: Imagen,
        archivo: Archivo
      };
      if (itemTable.tipo_tendido === 1) {
        itemTable.tipo_tendido = 'Automatico';
      } else if (itemTable.tipo_tendido === 2) {
        itemTable.tipo_tendido = 'Manual';
      } else {
        itemTable.tipo_tendido = 'Ambos';
      }
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

  ValidateAddCortadorAuditoriaEdit() {
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
      console.log('DETALLE: ', detalle);
      const detalleItem = {
        'Serie': detalle.Serie.Series,
        'Bulto': detalle.Bulto.Bulto,
        'IdTendido': detalle.Tendido.ID,
        'IdMesa': detalle.Mesa.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': +detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      const {Serie, Bulto, Tendido, Mesa, Posicion, Defecto, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        Serie: Serie.Series,
        Bulto: Bulto.Bulto,
        NombreTendido: Tendido.Nombre,
        tipo_tendido: Tendido.TipoTendido,
        NombreMesa: Mesa.Nombre,
        NombrePosicion: Posicion.Nombre,
        NombreDefecto: Defecto.Nombre,
        Cantidad: Cantidad,
        Nota: Nota,
        Imagen: Imagen,
        Archivo: Archivo
      };
      if (itemTable.tipo_tendido === 1) {
        itemTable.tipo_tendido = 'Automatico';
      } else if (itemTable.tipo_tendido === 2) {
        itemTable.tipo_tendido = 'Manual';
      } else {
        itemTable.tipo_tendido = 'Ambos';
      }
      this.items.push(itemTable);
      this.dataSourceEdit = new MatTableDataSource(this.items);
      this.initFormGroup();
      this.selectedFile = null;
    } else {
      this._toast.warning('Debe seleccionar una OT valida');
      const element = this.renderer.selectRootElement('#ddlOT');
      setTimeout(() => element.focus(), 0);
    }
  }

  eliminar(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.items);
  }

  eliminarEditar(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSourceEdit = new MatTableDataSource(this.items);
  }

  obtenerAuditorias() {
    const filtro = {
      Fecha_i: null,
      Fecha_f: null,
      IdCliente: null,
      Marca: null,
      PO: null,
      Corte: null,
      Planta: null,
      Estilo: null,
      Auditoria: 'Corte'
    };
    console.log('FILTRO', filtro);
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSourceWIP = new MatTableDataSource(res.Auditoria);
      }
    );
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
      this.obtenerAuditorias();
    } else {
      this._toast.warning(Mensaje, '');
    }
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

  getTotalDetalle() {
    return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
  }

}
