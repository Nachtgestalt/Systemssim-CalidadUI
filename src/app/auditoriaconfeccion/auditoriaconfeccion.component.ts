import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ConfeccionService} from '../services/confeccion/confeccion.service';
import {AuditoriaCorteService} from '../services/auditoria-corte/auditoria-corte.service';
import {AuditoriaConfeccionService} from '../services/auditoria-confeccion/auditoria-confeccion.service';
import {ClientesService} from '../services/clientes/clientes.service';
import swal from 'sweetalert';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var $: any;
declare var M: any;


@Component({
  selector: 'app-auditoriaconfeccion',
  templateUrl: './auditoriaconfeccion.component.html',
  styleUrls: ['./auditoriaconfeccion.component.css']
})
export class AuditoriaconfeccionComponent implements OnInit {
  @ViewChild('modalNewAuditoria', {read: ElementRef}) modalAgregar: ElementRef;
  @ViewChild('modalDetalle', {read: ElementRef}) modalDetalle: ElementRef;
  @ViewChild('modalEdit', {read: ElementRef}) modalEdit: ElementRef;

  private json_usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Planta', 'Fecha Inicio',
    'Fecha fin', 'Defectos', 'Status', 'Opciones'
  ];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Area', 'Operacion', 'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];

  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Area', 'Operacion', 'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo'];

  dataSourceEdit: MatTableDataSource<any>;
  displayedColumnsEdit: string[] = [
    'Serie', 'Bulto', 'Tendido', 'Tipo Tendido', 'Mesa', 'Posicion',
    'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo', 'Opciones'
  ];

  // Encabezado auditoria
  ordenTrabajo = '';
  bloquearOT = false;
  otValida = false;
  otDetalle;

  // Catalogos
  defectos = [];
  operaciones = [];
  areas = [];
  plantas = [];

  Det = [];
  items = [];

  selectedFile;
  loading = false;
  modalAgregarIsActive = false;
  modalDetalleIsActive = false;
  modalEditarIsActive = false;
  form: FormGroup;

  constructor(
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private _confeccionService: ConfeccionService,
    private _auditoriaCorteService: AuditoriaCorteService,
    private _auditoriaConfeccionService: AuditoriaConfeccionService,
    private _reporteService: ReportesService,
    private _clientesService: ClientesService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    this.obtenerAuditorias();
    this.obtenerCatalogos();
    this.initFormGroup();
    $('#lblModulo').text('Confección - Auditoría');
  }

  initFormGroup() {
    this.form = new FormGroup({
      'Area': new FormControl(),
      'Operacion': new FormControl(null, Validators.required),
      'Defecto': new FormControl(null, Validators.required),
      'Cantidad': new FormControl(null, Validators.required),
      'Segundas': new FormControl(),
      'Nota': new FormControl(),
      'Imagen': new FormControl(),
      'Archivo': new FormControl(),
      'NombreArchivo': new FormControl()
    });
  }

  obtenerCatalogos() {
    const defectos$ = this._confeccionService.listDefectos('', '', 'True');
    const operaciones$ = this._confeccionService.listOperaciones('', '', 'True');
    const areas$ = this._confeccionService.listAreas('', '', 'True');
    const plantas$ = this._confeccionService.listPlantas('', '', 'True');

    forkJoin(defectos$, operaciones$, areas$, plantas$)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.defectos = res[0].Vst_Confeccion;
          this.operaciones = res[1].Vst_Confeccion;
          this.areas = res[2].Vst_Confeccion;
          this.plantas = res[3].Vst_Plantas;
        }
      );
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
          }
        }, error1 => {
          console.log(error1);
        },
        () => {
          this.loading = false;
        }
      );
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
      Auditoria: 'Confeccion'
    };
    console.log('FILTRO', filtro);
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSourceWIP = new MatTableDataSource(res.Auditoria);
      }
    );
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
      this._auditoriaConfeccionService.createAuditoria(data)
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
    }
  }

  ValidateAddConfeccionAuditoria() {
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
        'IdArea': detalle.Area.ID,
        'IdOperacion': detalle.Operacion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': detalle.Cantidad,
        // 'Segundas': +detalle.Segundas,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      const {Area, Operacion, Defecto, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        area: Area.Nombre,
        operacion: Operacion.Nombre,
        defecto: Defecto.Nombre,
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
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.items);
  }

  agregarEditAuditoria() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => { // {1}
        const control = this.form.get(field);            // {2}
        control.markAsTouched({onlySelf: true});       // {3}
      });
      return;
    }
    if (this.ordenTrabajo !== '') {
      const detalle = this.form.value;
      console.log('DETALLE: ', detalle);
      const detalleItem = {
        'IdArea': detalle.Area.ID,
        'IdOperacion': detalle.Operacion.ID,
        'IdDefecto': detalle.Defecto.ID,
        'Cantidad': detalle.Cantidad,
        // 'Segundas': +detalle.Segundas,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      const {Area, Operacion, Defecto, Cantidad, Nota, Imagen, Archivo} = detalle;
      const itemTable = {
        NombreArea: Area.Nombre,
        NombreOperacion: Operacion.Nombre,
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
    }
  }

  editarAuditoria() {
    if (this.otDetalle.FechaRegistroFin !== null) {
      this.closeModalEditar();
      this.obtenerAuditorias();
    } else {
      if (this.Det.length > 0) {
        const data = {
          IdAuditoria: this.otDetalle.IdAuditoria,
          Det: this.Det
        };
        this._auditoriaConfeccionService.updateAuditoria(data)
          .subscribe(
            res => {
              this._toast.success('Se actualizo correctamente auditoria', '');
              console.log(res);
              this.closeModalEditar();
              this.obtenerAuditorias();
            },
            error => this._toast.error('Error al conectar a la base de datos', '')
          );
      }
    }
  }

  eliminarAuditoria(auditoria) {
    console.log(auditoria.IdAuditoria);
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
          this._auditoriaConfeccionService.deleteAuditoria(auditoria.IdAuditoria)
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
    }).then((willDelete) => {
      if (willDelete) {
        this._auditoriaConfeccionService.cierreAuditoria(this.otDetalle.IdAuditoria)
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

  openModalAgregar() {
    this.modalAgregarIsActive = true;
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
    this.modalAgregarIsActive = false;
    console.log('Estoy en cerrar');
    const modalAgregar = M.Modal.getInstance(this.modalAgregar.nativeElement);
    modalAgregar.destroy();
  }

  openModalDetalle(auditoria) {
    this.modalDetalleIsActive = true;
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


    this._auditoriaConfeccionService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  closeModalDetalle() {
    this.modalDetalleIsActive = false;
    console.log('Estoy en cerrar');
    const modalDetalle = M.Modal.getInstance(this.modalDetalle.nativeElement);
    modalDetalle.destroy();
  }

  openModalEditar(auditoria) {
    console.log('MODAL EDITAR', auditoria);
    this.modalEditarIsActive = true;
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

    this._auditoriaConfeccionService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
          this.otDetalle = res.RES;
          this.otValida = true;
          this.ordenTrabajo = this.otDetalle.OrdenTrabajo;
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
    this.modalEditarIsActive = false;
    console.log('Estoy en cerrar');
    const modalEdit = M.Modal.getInstance(this.modalEdit.nativeElement);
    modalEdit.destroy();
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

  getTotalDetalle() {
    return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
  }

  imprimirDetalle(auditoria) {
    console.log(auditoria);
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Confeccion')
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

  // UTILERIAS
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
