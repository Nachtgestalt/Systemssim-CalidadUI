import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {AuditoriaCalidadService} from '../services/calidad/auditoria-calidad.service';
import {ClientesService} from '../services/clientes/clientes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import * as moment from 'moment';
import 'jquery';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-calidad-consulta-auditoria',
  templateUrl: './calidad-consulta-auditoria.component.html',
  styleUrls: ['./calidad-consulta-auditoria.component.css']
})
export class CalidadConsultaAuditoriaComponent implements OnInit {
  options = ['Juan Juan Juan Juan', 'Pedro'];
  clientes = [];
  marcas = [];
  pos = [];
  cortes = [];
  plantas = [];
  estilos = [];
  ordenTrabajo = '';
  otDetalle;
  showModal = false;
  idClientes = [];

  clienteID = null;
  marcaID = null;
  poID = null;
  corteID = null;
  plantaID = null;
  estiloID = null;
  fecha_inicio = null;
  fecha_fin = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Cliente', 'Marca', 'PO', 'Corte', 'Planta', 'Estilo', 'Fecha Inicio',
    'Fecha fin', 'Pzas Recup.', 'Pzas Criterio', '2das Finales', 'Totales',
    'Status', 'Opciones'
  ];

  elem = document.querySelector('#modalNewAuditoria');

  form: FormGroup;
  formFilter: FormGroup;

  constructor(private _auditoriaCalidadService: AuditoriaCalidadService,
              private _clientesService: ClientesService) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {dismissible: false});
    this.initFormGroupFilter();
    this.initFormGroup();
    const plantas$ = this._clientesService.listPlanta();
    const estilos$ = this._clientesService.listEstilo();
    forkJoin(plantas$, estilos$).subscribe(
      (res: any) => {
        // this.plantas = res[0].P;
        // this.estilos = res[1].E;
      }
    );
    this._clientesService.listClientes()
      .subscribe((res: Array<any>) => {
        console.log(res);
        this.clientes = res;
      });
    // this.cargarAuditorias();
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
    });
  }

  cargarAuditorias() {
    this._auditoriaCalidadService.listAuditorias().subscribe(
      (res: any) => {
        this.dataSource = new MatTableDataSource(res.RES);
        console.log(res);
      }
    );
  }

  obtenerMarcas(client?) {
    if (client) {
      console.log('Entro a if client', client);
      this.formFilter.controls['Marca'].reset();
    }
    const idCliente = this.formFilter.controls['IdCliente'].value;
    if (idCliente !== null) {
      this.idClientes[0] = idCliente;
    }
    console.log(idCliente);
    console.log(this.idClientes.length);
    this._clientesService.listMarcas(this.idClientes.length > 0 ? this.idClientes : null)
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
    const idCliente = this.formFilter.controls['IdCliente'].value
    const filtro = {
      Fecha_i: fecha_inicio !== null ? moment(fecha_inicio).format('YYYY-MM-DD') : null,
      Fecha_f: fecha_fin !== null ? moment(fecha_fin).format('YYYY-MM-DD') : null,
      IdCliente: idCliente !== null ? `${idCliente}` : null,
      Marca: this.formFilter.controls['Marca'].value,
      PO: this.formFilter.controls['PO'].value,
      Corte: this.formFilter.controls['Corte'].value,
      Planta: null,
      Estilo: null,
      Auditoria: 'Calidad'
    };
    this._clientesService.busqueda(filtro).subscribe(
      (res: any) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res.Auditoria);
      }
    );
  }

  reset() {
    this.initFormGroupFilter();
  }

  openModal(auditoria) {
    this.otDetalle = auditoria;
    console.log(this.otDetalle);
  }

}
