import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {AuditoriaCalidadService} from '../services/calidad/auditoria-calidad.service';
import {ClientesService} from '../services/clientes/clientes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin, Observable, Subject} from 'rxjs';
import * as moment from 'moment';
import 'jquery';
import {TerminadoService} from '../services/terminado/terminado.service';
import {OperacionesService} from '../services/terminado/operaciones.service';
import {PosicionTerminadoService} from '../services/terminado/posicion-terminado.service';
import {OrigenTerminadoService} from '../services/terminado/origen-terminado.service';
import {DataTableDirective} from 'angular-datatables';
import {ToastrService} from 'ngx-toastr';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';

declare var $: any;
import * as M from 'materialize-css/dist/js/materialize';
import swal from 'sweetalert';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-calidad-consulta-auditoria',
  templateUrl: './calidad-consulta-auditoria.component.html',
  styleUrls: ['./calidad-consulta-auditoria.component.css']
})
export class CalidadConsultaAuditoriaComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElem: DataTableDirective;
  selectedFile: ImageSnippet;
  Det = [];
  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  options = [];
  clientes = [];
  marcas = [];
  pos = [];
  cortes = [];
  plantas = [];
  estilos = [];
  ordenTrabajo = '';
  show_modal = false;
  isActive = true;
  otDetalle;
  items = [];
  idClientes = [];

  clienteID = null;
  marcaID = null;
  poID = null;

  defectos = [];
  operaciones = [];
  posiciones = [];
  origenes = [];
  tipoDetalleAud = null;

  filteredOptions: Observable<any[]>;
  filteredOptionsPlanta: Observable<any>;
  filteredOptionsEstilo: Observable<any>;
  filteredOptionsMarca: Observable<any>;
  dataSource: MatTableDataSource<any>;
  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Cliente', 'Marca', 'PO', 'Corte', 'Planta', 'Estilo', 'Fecha Inicio',
    'Fecha fin', 'Pzas Recup.', 'Pzas Criterio', '2das Finales', 'Totales',
    'Status', 'Opciones'
  ];

  displayedColumnsDetalle: string[] = [
    'Defecto', 'Operacion', 'Posicion', 'Origen', 'Recup', 'Criterio', '2das',
    'Imagen', 'Nota', 'Archivo'];
  totalDetall = 0;
  form: FormGroup;
  formFilter: FormGroup;

  constructor(private _auditoriaCalidadService: AuditoriaCalidadService,
              private _defectoTerminadoService: TerminadoService,
              private _operacionTerminadoService: OperacionesService,
              private _posicionTerminadoService: PosicionTerminadoService,
              private _origenTerminadoService: OrigenTerminadoService,
              private _clientesService: ClientesService,
              private _reporteService: ReportesService,
              private _toast: ToastrService,
              private domSanitizer: DomSanitizer
  ) {
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
    $('#lblModulo').text('Calidad - Consulta auditoría calidad');
    const tooltips = document.querySelectorAll('.tooltipped');
    const instancesTooltip = M.Tooltip.init(tooltips, {});
    // $('.tooltipped').tooltip();
    const elems = document.querySelector('#modalNewAuditoria');
    const instances = M.Modal.init(elems, {dismissible: false});
    this.initFormGroupFilter();
    this.initFormGroup();
    this._clientesService.listClientes()
      .subscribe((res: Array<any>) => {
        console.log(res);
        this.clientes = res;
      });
    // this.cargarAuditorias();
  }

  ngAfterViewInit(): void {
    // const elems = document.querySelectorAll('select');
    // setTimeout(() => M.FormSelect.init(elems, {}), 1000);
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Fecha_i': new FormControl(null),
      'Fecha_f': new FormControl(null),
      'IdCliente': new FormControl(null),
      'Marca': new FormControl(null),
      'PO': new FormControl(null),
      'Corte': new FormControl(null),
      'Planta': new FormControl(null),
      'Estilo': new FormControl(null),
    });

    this.filteredOptions = this.formFilter.controls['IdCliente'].valueChanges
      .pipe(
        startWith<string>(''),
        map((value: any) => typeof value === 'string' ? value : value.Descripcion),
        map(name => name ? this._filter(name) : this.clientes.slice())
      );

    this.filteredOptionsPlanta = this.formFilter.controls['Planta'].valueChanges
      .pipe(
        // startWith<null>(null),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value: any) => {
            return this.filterPlant(value);
          }
        )
      );

    this.filteredOptionsEstilo = this.formFilter.controls['Estilo'].valueChanges
      .pipe(
        // startWith<null>(null),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value: any) => {
            return this.filterEstilo(value);
          }
        )
      );

    this.filteredOptionsMarca = this.formFilter.controls['Marca'].valueChanges
      .pipe(
        // startWith<null>(null),
        map((value: any) => {
            return this.filterMarca(value);
          }
        )
      );
  }

  initFormGroup() {
    this.form = new FormGroup({
      'Defecto': new FormControl('', [Validators.required]),
      'Operacion': new FormControl('', [Validators.required]),
      'Posicion': new FormControl('', [Validators.required]),
      'Origen': new FormControl('', [Validators.required]),
      'Imagen': new FormControl(),
      'Compostura': new FormControl(),
      'Nota': new FormControl(),
      'Recup': new FormControl(),
      'Criterio': new FormControl(),
      'Fin': new FormControl(),
      'Archivo': new FormControl(''),
      'NombreArchivo': new FormControl(),
    });
  }

  obtenerMarcas(client?) {
    if (client) {
      console.log('Entro a if client', client);
      this.formFilter.controls['Marca'].reset();
    }
    const idCliente = this.formFilter.controls['IdCliente'].value;
    console.log('IDCLIENTE: ', idCliente);
    if (idCliente !== null && idCliente !== '') {
      this.idClientes[0] = idCliente.IdClienteRef;
    } else {
      this.idClientes = [];
    }
    console.log(idCliente);
    this._clientesService.listMarcas(this.idClientes.length > 0 ? this.idClientes : null, 'Calidad')
      .subscribe((res: any) => {
        this.marcas = res.Marcas;
        console.log(res);
      });
  }

  obtenerPO() {
    const filtro = {
      IdCliente: this.clienteID,
      Marca: this.marcaID,
      Auditoria: 'Calidad'
    };
    this._clientesService.listPO(filtro).subscribe(
      (res: any) => {
        this.pos = res.PoList;
        console.log(res);
      }
    );
  }

  obtenerCorte() {
    const filtro = {
      IdCliente: this.clienteID,
      Marca: this.marcaID,
      PO: this.poID,
      Auditoria: 'Calidad'
    };
    this._clientesService.listCortes(filtro).subscribe(
      (res: any) => {
        this.cortes = res.CorteList;
        console.log(res);
      });
  }

  filterPlant(val: string) {
    return this._clientesService.listPlanta(val)
      .pipe(
        map((res: any) => res.P)
      );
  }

  filterEstilo(val: string) {
    return this._clientesService.listEstilo(val)
      .pipe(
        map((res: any) => res.E)
      );
  }

  buscar() {
    const fecha_inicio = this.formFilter.controls['Fecha_i'].value;
    const fecha_fin = this.formFilter.controls['Fecha_f'].value;
    const idCliente = this.formFilter.controls['IdCliente'].value;
    const filtro = {
      Fecha_i: fecha_inicio !== null ? moment(fecha_inicio).format('YYYY-MM-DD') : null,
      Fecha_f: fecha_fin !== null ? moment(fecha_fin).format('YYYY-MM-DD') : null,
      IdCliente: idCliente !== null ? `${idCliente.IdClienteRef}` : null,
      Marca: this.formFilter.controls['Marca'].value !== '' ? this.formFilter.controls['Marca'].value : null,
      PO: this.formFilter.controls['PO'].value !== '' ? this.formFilter.controls['PO'].value : null,
      Corte: this.formFilter.controls['Corte'].value !== '' ? this.formFilter.controls['Corte'].value : null,
      Planta: this.formFilter.controls['Planta'].value !== '' ? this.formFilter.controls['Planta'].value : null,
      Estilo: null,
      Auditoria: 'Calidad'
    };
    console.log('FILTRO', filtro);
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res.Auditoria);
      }
    );
  }

  reset() {
    this.otDetalle = {};
    this.selectedFile = null;
    this.initFormGroup();
    this.initFormGroupFilter();
    setTimeout(() => this.form.enable(), 100);
    this.dataSource = new MatTableDataSource();
    this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.items = [];
      this.dtTrigger.next();
    });
    this.Det = [];
    this.isActive = false;
    setTimeout(() => this.isActive = true, 100);
  }

  openModal(auditoria) {
    const defectos$ = this._defectoTerminadoService.listDefectos();
    const operaciones$ = this._operacionTerminadoService.listOperaciones();
    const posiciones$ = this._posicionTerminadoService.listPosiciones();
    const origenes$ = this._origenTerminadoService.listOrigenes();
    this._auditoriaCalidadService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.otDetalle = res.RES;
        setTimeout(() => M.updateTextFields(), 100);
        if (this.otDetalle.FechaRegistroFin !== null) {
          this.form.disable();
        } else {
          this.form.enable();
        }
        console.log(res);
        this.show_modal = true;
        this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.items = res.RES_DET;
          this.items.forEach(x => {
            x.Imagen = x.Aud_Imagen;
            this.Det.push(x);
          });
          console.log('DETALLE DESPUES DE CARGAR MODAL: ', this.Det);
          this.dtTrigger.next();
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
          console.log('TERMINE FORKJOIN');
        }
      );
  }

  validaAgregaAuditoria() {
    console.log(this.form.value);
    console.log(this.ordenTrabajo);
    if (!this.form.invalid) {
      const detalle = this.form.value;
      const detalleItem = {
        'IdDefecto': detalle.Defecto.ID,
        'IdOrigen': detalle.Origen.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdOperacion': detalle.Defecto.ID,
        'Revisado': false,
        'Compostura': !!detalle.Compostura,
        // 'cantidad': detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Recup': +detalle.Recup,
        'Criterio': +detalle.Criterio,
        'Fin': +detalle.Fin,
        'Archivo': detalle.Archivo
      };
      this.Det.push(detalleItem);
      console.log(this.Det);
      this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        const defecto = this.form.controls['Defecto'].value;
        const operacion = this.form.controls['Operacion'].value;
        const posicion = this.form.controls['Posicion'].value;
        const origen = this.form.controls['Origen'].value;
        const recup = this.form.controls['Recup'].value;
        const criterio = this.form.controls['Criterio'].value;
        const fin = this.form.controls['Fin'].value;
        const imagen = this.form.controls['Imagen'].value;
        dtInstance.destroy();
        const itemTable = {
          Defecto: defecto.Nombre,
          Operacion: operacion.Nombre,
          Posicion: posicion.Nombre,
          Origen: origen.Nombre,
          Recup: recup,
          Criterio: criterio,
          Fin: fin,
          Aud_Imagen: imagen,
          Nota: this.form.controls['Nota'].value
        };
        this.items.push(itemTable);
        this.form.reset();
        this.selectedFile = null;
        const elems = document.querySelectorAll('select');
        setTimeout(() => M.FormSelect.init(elems, {}), 500);
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    } else {
      this._toast.warning('Error en formulario', '');
    }
  }

  eliminar(index) {
    this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.Det.splice(index, 1);
      this.items.splice(index, 1);
      this.dtTrigger.next();
    });
  }

  guardarAuditoria() {
    if (this.otDetalle.FechaRegistroFin !== null) {
      const elem = document.querySelector('#modalNewAuditoria');
      const instance = M.Modal.getInstance(elem);
      instance.close();
      this.buscar();
      this.reset();
    } else {
      if (this.Det.length > 0) {
        const data = {
          IdAuditoria: this.otDetalle.IdAuditoria,
          Det: this.Det
        };
        this._auditoriaCalidadService.updateAuditoria(data)
          .subscribe(
            (res: any) => {
              if (res.Response.StatusCode === 200) {
                this._toast.success('Se actualizo correctamente auditoria calidad', '');
                console.log(res);
                const elem = document.querySelector('#modalNewAuditoria');
                const instance = M.Modal.getInstance(elem);
                instance.close();
                this.buscar();
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
          this._auditoriaCalidadService.deleteAuditoria(id)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Response.StatusCode !== 409) {
                  this._toast.success('Auditoria eliminada con exito', '');
                  this.buscar();
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
    })
      .then((willDelete) => {
        if (willDelete) {
          this._auditoriaCalidadService.cierreAuditoria(this.otDetalle.IdAuditoria)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res === null) {
                  this._toast.success('Auditoria cerrada con exito', '');
                  this.closeModal();
                  this.buscar();
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

  closeModal() {
    const elem = document.querySelector('#modalNewAuditoria');
    const instance = M.Modal.getInstance(elem);
    this.Det = [];
    instance.close();
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

  displayFn(cliente?): string | undefined {
    return cliente ? cliente.Descripcion : undefined;
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.clientes.filter(option => option.Descripcion.toLowerCase().includes(filterValue) === true);
  }

  filterMarca(name) {
    const filterValue = name.toLowerCase();

    return this.marcas.filter(option => option.toLowerCase().includes(filterValue) === true);
  }


  openModalDetalle(auditoria) {
    const modalDetalle = document.querySelector('#modal-detalle');
    M.Modal.init(modalDetalle);
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.open();
    this.totalDetall = auditoria.total;

    this._auditoriaCalidadService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.dataSourceDetalle = new MatTableDataSource(res.RES_DET);
        this.otDetalle = res.RES;
        console.log(res);
      });
  }

  openPDF(data, tipo?) {
    const linkSource = data;
    let fileName = '';
    const downloadLink = document.createElement('a');
    if (tipo === 'pdf') {
      fileName = 'archivo.pdf';
    } else {
      let extension = this.base64MimeType(data);
      console.log('EXTENSION: ', extension);
      fileName = `imagen.${extension}`;
      console.log(fileName);
    }

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    console.log(downloadLink.download);
    downloadLink.click();
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
    this._reporteService.getReporte(auditoria.IdAuditoria, 'Calidad')
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

  closeModalDetalle() {
    const modalDetalle = document.querySelector('#modal-detalle');
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.close();
  }


}

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src: string, public file: File) {
  }
}
