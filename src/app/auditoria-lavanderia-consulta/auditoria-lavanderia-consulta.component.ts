import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ClientesService} from '../services/clientes/clientes.service';
import {MatTableDataSource} from '@angular/material';
import * as moment from 'moment';
import {LavanderiaService} from '../services/lavanderia/lavanderia.service';
import {ReportesService} from '../services/reportes/reportes.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var M: any;

@Component({
  selector: 'app-auditoria-lavanderia-consulta',
  templateUrl: './auditoria-lavanderia-consulta.component.html',
  styleUrls: ['./auditoria-lavanderia-consulta.component.css']
})
export class AuditoriaLavanderiaConsultaComponent implements OnInit {

  displayedColumns: string[] = [
    'Corte', 'Cliente', 'Marca', 'PO', 'Cortadas', 'Fecha Inicio',
    'Fecha fin', 'Defectos', '2das', 'Status', 'Opciones'
  ];

  displayedColumnsDetalle: string[] = [
    'Posicion', 'Operacion', 'Defecto', 'Cantidad', 'Imagen', 'Nota', 'Archivo'];
  dataSource: MatTableDataSource<any>;
  dataSourceDetalle: MatTableDataSource<any>;

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

  formFilter: FormGroup;

  filteredOptions: Observable<any[]>;
  filteredOptionsMarca: Observable<any>;

  constructor(private _clientesService: ClientesService,
              private _lavanderiaService: LavanderiaService,
              private _reporteService: ReportesService,
              private domSanitizer: DomSanitizer,) {
  }

  ngOnInit() {
    $('#lblModulo').text('Lavandería - Consulta Auditoría');
    this.initFormGroupFilter();
    this._clientesService.listClientes()
      .subscribe((res: Array<any>) => {
        console.log(res);
        this.clientes = res;
      });
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

  reset() {
    // this.otDetalle = {};
    // this.selectedFile = null;
    // this.initFormGroup();
    this.initFormGroupFilter();
    // setTimeout(() => this.form.enable(), 100);
    // this.dataSource = new MatTableDataSource();
    // this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    //   this.items = [];
    //   this.dtTrigger.next();
    // });
    // this.Det = [];
    // this.isActive = false;
    // setTimeout(() => this.isActive = true, 100);
  }

  openModalDetalle(auditoria) {
    const modalDetalle = document.querySelector('#modal-detalle');
    M.Modal.init(modalDetalle);
    const modalInstance = M.Modal.getInstance(modalDetalle);
    modalInstance.open();
    // this.totalDetalle = auditoria.total;

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
