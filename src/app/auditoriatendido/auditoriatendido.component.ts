import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material';
import * as M from 'materialize-css/dist/js/materialize';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CorteService} from '../services/corte/corte.service';
import {AuditoriaCorteService} from '../services/auditoria-corte/auditoria-corte.service';
import {forkJoin} from 'rxjs';
import {AuditoriaTendidoService} from '../services/auditoria-tendido/auditoria-tendido.service';
import {ClientesService} from '../services/clientes/clientes.service';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-auditoriatendido',
  templateUrl: './auditoriatendido.component.html',
  styleUrls: ['./auditoriatendido.component.css']
})
export class AuditoriatendidoComponent implements OnInit {
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
    'Cortador', 'Serie', 'Bulto', 'Posicion', 'Defecto',
    'Tolerancia', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];

  dataSourceEdit: MatTableDataSource<any>;
  displayedColumnsEdit: string[] = [
    'Cortador', 'Serie', 'Bulto', 'Posicion', 'Defecto',
    'Tolerancia', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];

  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Cortador', 'Serie', 'Bulto', 'Posicion', 'Defecto',
    'Tolerancia', 'Cantidad', 'Nota', 'Imagen', 'Archivo'
  ];
  items = [];
  Det = [];
  valueChangesSerie$;

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
    private _clientesService: ClientesService,
    private _auditoriaTendidoService: AuditoriaTendidoService,
    private _auditoriaCorteService: AuditoriaCorteService,
    private _toast: ToastrService,
    private _reporteService: ReportesService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#lblModulo').text('Tendido - Auditoría');
    this.initFormGroup();
    this.obtenerAuditorias();
    this.obtenerCatalogos();
  }

  initFormGroup() {
    this.form = new FormGroup({
      'Cortador': new FormControl(null, Validators.required),
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

    this.valueChangesSerie$ = this.form.get('Serie').valueChanges
      .subscribe(
        serie => {
          if (serie) {
            if (this.otValida) {
              this._auditoriaCorteService.getBultosByOTAndSerie(this.ordenTrabajo, serie.Series)
                .subscribe((res: any) => this.bultos = res.Bulto);
            }
          }
        }
      );
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
          this._auditoriaTendidoService.cierreAuditoria(this.otDetalle.IdAuditoria)
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

  ValidateSave() {
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
      this._auditoriaTendidoService.createAuditoria(data)
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
      Auditoria: 'Tendido'
    };
    console.log('FILTRO', filtro);
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSourceWIP = new MatTableDataSource(res.Auditoria);
      }
    );
  }

  ValidateAddTendidoAuditoria() {
    console.log(this.Det);
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
      console.log('DETALLE:', detalle);
      const detalleItem = {
        'IdCortador': detalle.Cortador.ID,
        'Serie': detalle.Serie.Series,
        'Bulto': `${detalle.Bulto.Bulto}`,
        'IdCortado': detalle.Tolerancia.IdTolerancia,
        'IdPosicion': detalle.Posicion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': +detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      console.log('DETALLE ITEM: ', detalleItem);
      this.Det.push(detalleItem);
      const {Cortador, Serie, Bulto, Posicion, Defecto, Tolerancia, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        cortador: Cortador.Nombre,
        serie: Serie.Series,
        bulto: Bulto.Bulto,
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
      console.log(this.Det);
    } else {
      this._toast.warning('Debe seleccionar una OT valida');
      const element = this.renderer.selectRootElement('#ddlOT');
      setTimeout(() => element.focus(), 0);
    }
  }

  ValidateAddTendidoAuditoriaEdit() {
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
        'IdCortador': detalle.Cortador.ID,
        'Serie': detalle.Serie.Series,
        'Bulto': `${detalle.Bulto.Bulto}`,
        'IdCortado': detalle.Tolerancia.IdTolerancia,
        'IdPosicion': detalle.Posicion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': +detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      const {Cortador, Serie, Bulto, Posicion, Defecto, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        Cortador: Cortador.Nombre,
        Serie: Serie.Series,
        Bulto: Bulto.Bulto,
        NombrePosicion: Posicion.Nombre,
        NombreDefecto: Defecto.Nombre,
        Cantidad: Cantidad,
        Nota: Nota,
        Imagen: Imagen,
        Archivo: Archivo
      };
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

  guardarAuditoriaEdit() {
    if (this.Det.length > 0) {
      const data = {
        IdAuditoria: this.otDetalle.IdAuditoria,
        Det: this.Det
      };
      this._auditoriaTendidoService.updateAuditoria(data)
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

  eliminar(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.items);
  }

  eliminarEdit(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSourceEdit = new MatTableDataSource(this.items);
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
          this._auditoriaTendidoService.deleteAuditoria(id)
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
    this._auditoriaTendidoService.getAuditoriaDetail(auditoria.IdAuditoria)
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

    this._auditoriaTendidoService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
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

  reset() {
    console.log('Estoy en reset');
    this.initFormGroup();
    this.items = [];
    this.Det = [];
    this.otDetalle = null;
    this.bloquearOT = false;
    this.ordenTrabajo = '';
    this.dataSource = new MatTableDataSource();
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Tendido')
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
