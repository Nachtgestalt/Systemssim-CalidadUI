import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

declare var $: any;
declare var M: any;
import 'jquery';
import {TerminadoService} from '../services/terminado/terminado.service';
import {OperacionesService} from '../services/terminado/operaciones.service';
import {PosicionTerminadoService} from '../services/terminado/posicion-terminado.service';
import {OrigenTerminadoService} from '../services/terminado/origen-terminado.service';
import {forkJoin, Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {ToastrService} from 'ngx-toastr';
import {AuditoriaTerminadoService} from '../services/terminado/auditoria-terminado.service';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import swal from 'sweetalert';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as moment from '../terminado-consulta-auditoria/terminado-consulta-auditoria.component';
import {ClientesService} from '../services/clientes/clientes.service';

@Component({
  selector: 'app-terminado-audiotoria-defectos',
  templateUrl: './terminado-audiotoria-defectos.component.html',
  styleUrls: ['./terminado-audiotoria-defectos.component.css']
})
export class TerminadoAudiotoriaDefectosComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild(DataTableDirective) dtElem: DataTableDirective;

  constructor(private _defectoTerminadoService: TerminadoService,
              private _operacionTerminadoService: OperacionesService,
              private _posicionTerminadoService: PosicionTerminadoService,
              private _origenTerminadoService: OrigenTerminadoService,
              private _terminadoAuditoriaService: AuditoriaTerminadoService,
              private _reporteService: ReportesService,
              private _clientesService: ClientesService,
              private _toast: ToastrService,
              private domSanitizer: DomSanitizer,
              private router: Router) {
  }

  tituloModalDetalle = '';
  totalDetalle = 0;
  tipoDetalleAud = null;
  form: FormGroup;
  private Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  selectedFile: ImageSnippet;
  defectos = [];
  operaciones = [];
  posiciones = [];
  origenes = [];
  ordenesTrabajo = [];
  auditorias = [];

  otDetalle;
  mostrarOT = false;
  bloquearOT = false;
  ordenTrabajo = '';
  items = [];
  Det = [];

  dtOptions = {};
  displayedColumns: string[] = [
    'Cliente', 'Marca', 'PO', 'Corte', 'Planta', 'Estilo', 'Fecha Inicio',
    'Fecha fin', 'Composturas', '2das', 'Status', 'Opciones'
  ];
  displayedColumnsDetalle: string[] = [
    'Defecto', 'Operacion', 'Posicion', 'Origen', 'Cantidad', 'Imagen', 'Nota'];
  displayedColumnsEdit: string[] = [
    'Defecto', 'Operacion', 'Posicion', 'Origen', 'Cantidad', 'Imagen', 'Nota', 'Opciones'];
  dataSource: MatTableDataSource<any>;
  dataSourceDetalle: MatTableDataSource<any>;
  dataSourceEdit: MatTableDataSource<any>;
  // dataSource = [];
  dtTrigger: Subject<any> = new Subject();
  dtTriggerPrincipal: Subject<any> = new Subject();

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
    this.initFormGroup();
    $('#lblModulo').text('Terminado - Registro auditoría terminado');
    $('.tooltipped').tooltip();

    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {dismissible: false});
    const defectos$ = this._defectoTerminadoService.listDefectos('', '', 'True');
    const operaciones$ = this._operacionTerminadoService.listOperaciones('', '', 'True');
    const posiciones$ = this._posicionTerminadoService.listPosiciones('', '', 'True');
    const origenes$ = this._origenTerminadoService.listOrigenes('', '', 'True');

    this.cargarAuditorias();

    forkJoin(defectos$, operaciones$, posiciones$, origenes$)
      .subscribe(
        (res: Array<any>) => {
          console.log(res);
          this.defectos = res[0].Vst_Terminado;
          this.operaciones = res[1].COperacionTerminados;
          this.posiciones = res[2].c_posicion_t;
          this.origenes = res[3].c_origen_t;
          const elems = document.querySelectorAll('select');
          setTimeout(() => M.FormSelect.init(elems, {}), 500);
        }
      );
  }

  ngAfterViewChecked(): void {
    M.updateTextFields();
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
      'Origen': new FormControl('', [Validators.required]),
      'Cantidad': new FormControl('', [Validators.required]),
      'Imagen': new FormControl(),
      'Compostura': new FormControl(null, [Validators.required]),
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
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res.Auditoria);
      }
    );

    // this._terminadoAuditoriaService.listAuditorias().subscribe(
    //   (res: any) => {
    //     this.dataSource = new MatTableDataSource(res.RES);
    //     console.log(res);
    //   }
    // );
  }

  cargarOT() {
    this.mostrarOT = true;
    this._terminadoAuditoriaService.listOT()
      .subscribe(
        (ot: any) => {
          console.log(ot);
          this.ordenesTrabajo = ot.OrdenTrabajo;
          console.log(this.ordenesTrabajo);
          const elems = document.querySelectorAll('select');
          setTimeout(() => M.FormSelect.init(elems, {}), 500);
        }
      );
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
        'IdOrigen': detalle.Origen.ID,
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
    console.log(this.form.invalid);
    if (!this.form.invalid) {
      const detalle = this.form.value;
      const detalleItem = {
        'IdDefecto': detalle.Defecto.ID,
        'IdOrigen': detalle.Origen.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdOperacion': detalle.Defecto.ID,
        'Revisado': false,
        'Compostura': detalle.Compostura,
        'cantidad': detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      console.log(this.Det);
      // this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      const defecto = this.form.controls['Defecto'].value;
      const operacion = this.form.controls['Operacion'].value;
      const posicion = this.form.controls['Posicion'].value;
      const origen = this.form.controls['Origen'].value;
      const cantidad = this.form.controls['Cantidad'].value;
      const imagen = this.form.controls['Imagen'].value;
      // dtInstance.destroy();
      const itemTable = {
        Defecto: defecto.Nombre,
        Operacion: operacion.Nombre,
        Posicion: posicion.Nombre,
        Origen: origen.Nombre,
        Cantidad: cantidad,
        Aud_Imagen: imagen,
        Nota: this.form.controls['Nota'].value
      };
      this.items.push(itemTable);
      this.dataSourceEdit = new MatTableDataSource(this.items);
      this.form.reset();
      this.selectedFile = null;
      const elems = document.querySelectorAll('select');
      setTimeout(() => M.FormSelect.init(elems, {}), 500);
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      // });
    } else {
      this._toast.warning('Se debe seleccionar una orden de trabajo valida', '');
    }
  }

  eliminar(index) {
    this.Det.splice(index, 1);
    this.items.splice(index, 1);
    this.dataSourceEdit = new MatTableDataSource(this.items);
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    //   this.Det.splice(index, 1);
    //   this.items.splice(index, 1);
    //   this.dtTrigger.next();
    // });
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
          this._terminadoAuditoriaService.cierreAuditoria(this.otDetalle.IdAuditoria)
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
    const elem = document.querySelector('#modalEditCategoria');
    const instance = M.Modal.getInstance(elem);
    this.Det = [];
    instance.close();
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
      this._terminadoAuditoriaService.createAuditoria(data)
        .subscribe(
          res => {
            this._toast.success('Se agrego correctamente auditoria terminado', '');
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

  guardarAuditoriaEdit() {
    if (this.otDetalle.FechaRegistroFin !== null) {
      const elem = document.querySelector('#modalEditCategoria');
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
        this._terminadoAuditoriaService.updateAuditoria(data)
          .subscribe(
            res => {
              this._toast.success('Se actualizo correctamente auditoria calidad', '');
              console.log(res);
              const elem = document.querySelector('#modalEditCategoria');
              const instance = M.Modal.getInstance(elem);
              instance.close();
              this.cargarAuditorias();
              this.reset();
            }
          );
      } else {
        this._toast.warning('La auditoría debe contener al menos un detalle', '');
      }
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
          this._terminadoAuditoriaService.deleteAuditoria(id)
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

  openModal(auditoria) {
    const defectos$ = this._defectoTerminadoService.listDefectos();
    const operaciones$ = this._operacionTerminadoService.listOperaciones();
    const posiciones$ = this._posicionTerminadoService.listPosiciones();
    const origenes$ = this._origenTerminadoService.listOrigenes();
    this._terminadoAuditoriaService.getAuditoriaDetail(auditoria.IdAuditoria)
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


    forkJoin(defectos$, operaciones$, posiciones$, origenes$)
      .subscribe(
        (res: Array<any>) => {
          console.log(res);
          this.defectos = res[0].Vst_Terminado;
          this.operaciones = res[1].COperacionTerminados;
          this.posiciones = res[2].c_posicion_t;
          this.origenes = res[3].c_origen_t;
        },
        error => console.log(error),
        () => {
          const elems = document.querySelectorAll('select');
          setTimeout(() => M.FormSelect.init(elems, {}), 1000);
        }
      );
  }

  openModalDetalle(auditoria, tipo) {
    this.tipoDetalleAud = tipo;
    this.tituloModalDetalle = tipo.toUpperCase();
    const modalDetalle = document.querySelector('#modal-detalle');
    M.Modal.init(modalDetalle);
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.open();
    this.totalDetalle = auditoria.total;

    this._terminadoAuditoriaService.getAuditoriaDetail(auditoria.IdAuditoria, tipo)
      .subscribe((res: any) => {
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  openImage(imagen) {
    const base64ImageData = imagen;
    let extension = this.base64MimeType(imagen);
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

  closeModalDetalle() {
    const modalDetalle = document.querySelector('#modal-detalle');
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.close();
  }

  processFile(imageInput: any, nuevo: boolean, tipo) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {
      if (tipo === 'imagen') {
        this.form.get('Imagen').patchValue(event.target.result);
        this.selectedFile = new ImageSnippet(event.target.result, file);
        this.selectedFile.pending = true;
      } else if (tipo === 'archivo') {
        this.form.get('Archivo').patchValue(event.target.result);
      }
      // nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
    });

    reader.readAsDataURL(file);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Terminado', this.tipoDetalleAud)
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

}

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {
  }
}

class OtDetalle {
  ID_Cliente: any;
  Cliente: string;
  PO: string;
  Tela_int: string;
  Marca: string;
  No_Cortada: string;
  Lavado: string;
  Estilo: string;
  Planta: string;
  Ruta: string;
}
