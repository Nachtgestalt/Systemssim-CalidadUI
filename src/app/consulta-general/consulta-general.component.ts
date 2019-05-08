import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {ClientesService} from '../services/clientes/clientes.service';
import {ReportesService} from '../services/reportes/reportes.service';

@Component({
  selector: 'app-consulta-general',
  templateUrl: './consulta-general.component.html',
  styleUrls: ['./consulta-general.component.css']
})
export class ConsultaGeneralComponent implements OnInit {

  auditoriaCorte = [];
  auditoriaConfeccion = [];
  auditoriaLavanderia = [];
  auditoriaProcesos = [];
  auditoriaTerminado = [];

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

  filteredOptions: Observable<any[]>;
  filteredOptionsMarca: Observable<any>;
  formFilter: FormGroup;
  constructor(private _clientesService: ClientesService,
              private _reporteService: ReportesService) { }
  tipoAuditorias = ['Corte', 'Tendido', 'Lavanderia', 'Terminado'];
  ngOnInit() {
    this.initFormGroupFilter();
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
    this._reporteService.consultaGeneral(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.auditoriaCorte = res.AuditoriaCorte;
        this.auditoriaConfeccion = res.AuditoriaConfeccion;
        this.auditoriaLavanderia = res.AuditoriaLavanderia;
        this.auditoriaProcesos = res.AuditoriaProcesos;
        this.auditoriaTerminado = res.AuditoriaTerminado;
        // this.dataSourceWIP = new MatTableDataSource(res.Auditoria);
      }
    );
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

}
