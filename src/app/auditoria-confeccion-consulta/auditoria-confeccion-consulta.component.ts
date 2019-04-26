import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AuditoriaConfeccionService} from '../services/auditoria-confeccion/auditoria-confeccion.service';
import {ClientesService} from '../services/clientes/clientes.service';
import {FormControl, FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';

declare var M: any;

@Component({
  selector: 'app-auditoria-confeccion-consulta',
  templateUrl: './auditoria-confeccion-consulta.component.html',
  styleUrls: ['./auditoria-confeccion-consulta.component.css']
})
export class AuditoriaConfeccionConsultaComponent implements OnInit {
  @ViewChild('modalDetalle', {read: ElementRef}) modalDetalle: ElementRef;

  dataSourceWIP: MatTableDataSource<any>;
  displayedColumnsWIP: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Planta', 'Fecha Inicio',
    'Fecha fin', 'Defectos', 'Status'
  ];

  dataSourceDetalle: MatTableDataSource<any>;
  displayedColumnsDetalle: string[] = [
    'Area', 'Operacion', 'Defecto', 'Cantidad', 'Nota', 'Imagen', 'Archivo'];

  // Encabezado auditoria
  ordenTrabajo = '';
  otDetalle;

  idClientes = [];
  clienteID = null;
  marcaID = null;
  poID = null;

  options = [];
  clientes = [];
  marcas = [];
  pos = [];
  cortes = [];

  modalDetalleIsActive = false;

  filteredOptions: Observable<any[]>;
  filteredOptionsMarca: Observable<any>;
  formFilter: FormGroup;
  constructor(private _reporteService: ReportesService,
              private _clientesService: ClientesService,
              private _auditoriaConfeccionService: AuditoriaConfeccionService,
              public domSanitizer: DomSanitizer) { }

  ngOnInit() {
    $('#lblModulo').text('Confección - Consulta Auditoría Confección');
    this.initFormGroupFilter();
    this._clientesService.listClientes()
      .subscribe((res: Array<any>) => {
        console.log(res);
        this.clientes = res;
      });
    this.initFormGroupFilter();
    this.obtenerAuditorias();
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

    this.filteredOptionsMarca = this.formFilter.controls['Marca'].valueChanges
      .pipe(
        // startWith<null>(null),
        map((value: any) => {
            return this.filterMarca(value);
          }
        )
      );
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

  reset() {
      this.initFormGroupFilter();
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

  getTotalDetalle() {
    return this.dataSourceDetalle.data.map(t => t.Cantidad).reduce((acc, value) => acc + value, 0);
  }

  // UTILERIAS
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
