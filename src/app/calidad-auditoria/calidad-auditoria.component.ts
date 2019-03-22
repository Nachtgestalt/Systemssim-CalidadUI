import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {TerminadoService} from '../services/terminado/terminado.service';
import {OperacionesService} from '../services/terminado/operaciones.service';
import {PosicionTerminadoService} from '../services/terminado/posicion-terminado.service';
import {OrigenTerminadoService} from '../services/terminado/origen-terminado.service';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {forkJoin, Subject} from 'rxjs';
import 'jquery';
import {AuditoriaCalidadService} from '../services/calidad/auditoria-calidad.service';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-calidad-auditoria',
  templateUrl: './calidad-auditoria.component.html',
  styleUrls: ['./calidad-auditoria.component.css']
})
export class CalidadAuditoriaComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(private _defectoTerminadoService: TerminadoService,
              private _operacionTerminadoService: OperacionesService,
              private _posicionTerminadoService: PosicionTerminadoService,
              private _origenTerminadoService: OrigenTerminadoService,
              private _auditoriaCalidadService: AuditoriaCalidadService,
              private _toast: ToastrService) {
  }

  form: FormGroup;
  private Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  selectedFile: ImageSnippet;
  defectos = [];
  operaciones = [];
  posiciones = [];
  origenes = [];
  ordenesTrabajo = [];
  auditorias = [];

  otDetalle = new OtDetalle();
  mostrarOT = false;
  bloquearOT = false;
  ordenTrabajo = '';
  items = [];
  Det = [];

  dtOptions = {};
  displayedColumns: string[] = [
    'Opciones', 'Numero', 'Cliente', 'OrdenTrabajo', 'PO', 'Marca', 'NumCortada', 'Lavado', 'Estilo', 'Planta'
  ];
  dataSource: MatTableDataSource<any>;
  // dataSource = [];
  dtTrigger: Subject<any> = new Subject();

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
    $('#lblModulo').text('Calidad - Registro auditoría calidad');
    $('.tooltipped').tooltip();

    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {dismissible: false});
    const defectos$ = this._defectoTerminadoService.listDefectos();
    const operaciones$ = this._operacionTerminadoService.listOperaciones();
    const posiciones$ = this._posicionTerminadoService.listPosiciones();
    const origenes$ = this._origenTerminadoService.listOrigenes();

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

  cargarOT() {
    this.mostrarOT = true;
    this._auditoriaCalidadService.listOT()
      .subscribe(
        (ot: any) => {
          console.log(ot);
          // this.ordenesTrabajo = ot.OrdenTrabajo;
          console.log(this.ordenesTrabajo);
          const elems = document.querySelectorAll('select');
          setTimeout(() => M.FormSelect.init(elems, {}), 500);
        }
      );
  }

  detalleOT(ot) {
    console.log(ot);
    this._auditoriaCalidadService.getDetailOT(ot)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.StatusCode === 409) {
            this.otDetalle = new OtDetalle();
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
        'Compostura': !!detalle.Compostura,
        // 'cantidad': detalle.Cantidad,
        'Imagen': detalle.Imagen,
        'Nota': detalle.Nota,
        'Recup': detalle.Recup,
        'Criterio': detalle.Criterio,
        'Fin': detalle.Fin
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

  eliminar(index) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.Det.splice(index, 1);
      this.items.splice(index, 1);
      this.dtTrigger.next();
    });
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
      this._auditoriaCalidadService.createAuditoria(data)
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
          error => this._toast.error('No se agrego correctamente el cierre de auditoría', '')
        );
    } else {
      this._toast.warning('La auditoría debe contener al menos un detalle', '');
    }
  }

  reset() {
    this.otDetalle = new OtDetalle();
    this.bloquearOT = false;
    this.ordenTrabajo = '';
    this.form.reset();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.items = [];
      this.dtTrigger.next();
    });
    const elems = document.querySelectorAll('select');
    setTimeout(() => M.FormSelect.init(elems, {}), 500);
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
