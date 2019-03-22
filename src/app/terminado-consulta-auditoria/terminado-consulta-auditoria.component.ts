import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {forkJoin, Observable, Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {TerminadoService} from '../services/terminado/terminado.service';
import {OperacionesService} from '../services/terminado/operaciones.service';
import {PosicionTerminadoService} from '../services/terminado/posicion-terminado.service';
import {OrigenTerminadoService} from '../services/terminado/origen-terminado.service';
import {ClientesService} from '../services/clientes/clientes.service';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {AuditoriaTerminadoService} from '../services/terminado/auditoria-terminado.service';
import {DataTableDirective} from 'angular-datatables';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-terminado-consulta-auditoria',
  templateUrl: './terminado-consulta-auditoria.component.html',
  styleUrls: ['./terminado-consulta-auditoria.component.css']
})
export class TerminadoConsultaAuditoriaComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElem: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions = {};

  clientes = [];
  marcas = [];
  pos = [];
  cortes = [];
  idClientes = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Cliente', 'Marca', 'PO', 'Corte', 'Planta', 'Estilo', 'Fecha Inicio',
    'Fecha fin', 'Cantidad', 'Status', 'Opciones'
  ];

  filteredOptions: Observable<any[]>;
  filteredOptionsPlanta: Observable<any>;
  filteredOptionsEstilo: Observable<any>;

  form: FormGroup;
  formFilter: FormGroup;

  otDetalle;
  defectos = [];
  operaciones = [];
  posiciones = [];
  origenes = [];
  items = [];
  Det = [];

  selectedFile: ImageSnippet;

  constructor(private _defectoTerminadoService: TerminadoService,
              private _operacionTerminadoService: OperacionesService,
              private _posicionTerminadoService: PosicionTerminadoService,
              private _origenTerminadoService: OrigenTerminadoService,
              private _clientesService: ClientesService,
              private _terminadoAuditoriaService: AuditoriaTerminadoService,
              private _toast: ToastrService) { }

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
    $('.tooltipped').tooltip();
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {dismissible: false});
    this.initFormGroupFilter();
    this.initFormGroup();

    this._clientesService.listClientes()
      .subscribe((res: Array<any>) => {
        console.log(res);
        this.clientes = res;
      });
  }

  ngAfterViewInit(): void {
    const elems = document.querySelectorAll('select');
    setTimeout(() => M.FormSelect.init(elems, {}), 1000);
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
      'Compostura': new FormControl(),
      'Nota': new FormControl()
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
    this._clientesService.listMarcas(this.idClientes.length > 0 ? this.idClientes : null)
      .subscribe((res: any) => {
        this.marcas = res.Marcas;
        console.log(res);
      });
  }

  obtenerPO() {
    const clienteID = this.formFilter.controls['IdCliente'].value;
    const filtro = {
      IdCliente: clienteID !== null ? clienteID.IdClienteRef : null,
      Marca: this.formFilter.controls['Marca'].value,
      Auditoria: 'Terminado'
    };
    this._clientesService.listPO(filtro).subscribe(
      (res: any) => {
        this.pos = res.PoList;
        console.log(res);
      }
    );
  }

  obtenerCorte() {
    const clienteID = this.formFilter.controls['IdCliente'].value;
    const filtro = {
      IdCliente: clienteID !== null ? clienteID.IdClienteRef : null,
      Marca: this.formFilter.controls['Marca'].value,
      PO: this.formFilter.controls['PO'].value,
      Auditoria: 'Terminado'
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
      Planta: this.formFilter.controls['Planta'].value !== '' ? this.formFilter.controls['Planta'].value : null,
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
  }

  reset() {
    this.initFormGroupFilter();
    this.initFormGroup();
    this.dataSource = new MatTableDataSource();
  }

  openModal(auditoria) {
    const defectos$ = this._defectoTerminadoService.listDefectos();
    const operaciones$ = this._operacionTerminadoService.listOperaciones();
    const posiciones$ = this._posicionTerminadoService.listPosiciones();
    const origenes$ = this._origenTerminadoService.listOrigenes();
    this._terminadoAuditoriaService.getAuditoriaDetail(auditoria.IdAuditoria)
      .subscribe((res: any) => {
        this.otDetalle = res.RES;
        console.log(res);
        this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.items = res.RES_DET;
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
          const elems = document.querySelectorAll('select');
          setTimeout(() => M.FormSelect.init(elems, {}), 1000);
        }
      );
  }

  validaAgregaAuditoria() {
    console.log(this.form.invalid);
    if (!this.form.invalid) {
      const detalle = this.form.value;
      const detalleItem = {
        'IdDefecto': detalle.Defecto.ID,
        'IdOrigen': detalle.Origen.ID,
        'IdPosicion': detalle.Posicion.ID,
        'IdOperacion': detalle.Defecto.ID,
        'Revisado': false,
        'Compostura': !!detalle.Compostura,
        'cantidad': detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota
      };
      this.Det.push(detalleItem);
      console.log(this.Det);
      this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
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

  eliminar(index) {
    this.dtElem.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.Det.splice(index, 1);
      this.items.splice(index, 1);
      this.dtTrigger.next();
    });
  }

  guardarAuditoria() {
  }

  processFile(imageInput: any, nuevo: boolean) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
      this.form.get('Imagen').patchValue(event.target.result);
      // nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
    });

    reader.readAsDataURL(file);
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

  displayFn(cliente?): string | undefined {
    return cliente ? cliente.Descripcion : undefined;
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.clientes.filter(option => option.Descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

}

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {
  }
}
