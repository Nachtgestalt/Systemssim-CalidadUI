import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import {CorteService} from '../services/corte/corte.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-tendido',
  templateUrl: './tendido.component.html',
  styleUrls: ['./tendido.component.css']
})
export class TendidoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  private json_usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  dtOptions = {
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
  optionModule = [
    {value: 1, viewValue: 'Automático'},
    {value: 2, viewValue: 'Manual'},
    {value: 3, viewValue: 'Ambos'}
  ];
  tendidos = [];

  formFilter: FormGroup;
  form: FormGroup;

  constructor(
    private _cortadoresService: CorteService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewTendido').modal();
    $('#modalEditTendido').modal();
    $('#modalEnableTendido').modal();
    $('#lblModulo').text('Tendido - Corte');
    this.initFormGroupFilter();
    this.initFormGroup();
    this.obtenerTendidos();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroupFilter() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  initFormGroup() {
    this.form = new FormGroup({
      'ID': new FormControl(),
      'IdSubModulo': new FormControl(2),
      'IdUsuario': new FormControl(this.json_usuario.ID),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'TipoTendido': new FormControl(1)
    });
  }

  obtenerTendidos() {
    this._cortadoresService.listTendidos(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (tendidos: any) => {
          console.log(tendidos);
          if (tendidos.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.tendidos = tendidos.Vst_Cortadores;
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  getDetalle(tendido) {
    this.reset();
    this._cortadoresService.getCortador(tendido.ID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.form.patchValue(res.Vst_Cortador);
        }
      );
  }

  GetEnabledTendido(tendido) {
    const options = {
      text: '¿Estas seguro de modificar este tendido?',
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
    };
    swal(options)
      .then((willDelete) => {
          if (willDelete) {
            this._cortadoresService.inactivaActivaTendido(tendido.ID)
              .subscribe(
                (res: any) => {
                  // console.log(res);
                  if (res.Message.IsSuccessStatusCode) {
                    this._toast.success('Tendido actualizado con exito', '');
                    this.obtenerTendidos();
                  }
                },
                error => {
                  console.log(error);
                  this._toast.error('No se pudo establecer conexión a la base de datos', '');
                }
              );
          }
        }
      );
  }

  NewTendido() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de tendido', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de tendido', '');
    } else {
      this._cortadoresService.createTendido(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se agrego correctamente el tendido', '');
              $('#modalNewTendido').modal('close');
              this.obtenerTendidos();
            } else {
              this._toast.warning('Algo salio mal', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    }
  }

  EditTendido() {
    if ($('#CVE_EDT_TENDIDO').val() === '') {
      this._toast.warning('Se debe ingresar una clave de tendido', '');
    } else if ($('#NOMBRE_EDT_TENDIDO').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de tendido', '');
    } else {
      this._cortadoresService.updateTendido(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se actualizo correctamente el tendido', '');
              $('#modalEditTendido').modal('close');
              this.obtenerTendidos();
            } else {
              this._toast.warning('Algo salio mal', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    }
  }

  eliminar(cortador) {
    console.log('eliminar: ', cortador);
    swal({
      text: '¿Estas seguro de eliminar este tendido?',
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
          this._cortadoresService.deleteCortador(cortador.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Tendido eliminado con exito', '');
                  this.obtenerTendidos();
                } else {
                  const mensaje = res.Hecho.split(',');
                  this._toast.warning(mensaje[0], mensaje[2]);
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
    this.initFormGroup();
  }
}
