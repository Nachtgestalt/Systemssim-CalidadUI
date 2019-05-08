import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {CorteService} from '../services/corte/corte.service';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})
export class MesaComponent implements OnInit, OnDestroy, AfterViewInit {
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

  mesas = [];
  form: FormGroup;
  formFilter: FormGroup;

  constructor(
    private _cortadoresService: CorteService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewMesa').modal();
    $('#modalEditMesa').modal();
    $('#modalEnableMesa').modal();
    $('#lblModulo').text('Corte - # Mesa');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerMesas();
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
      'ID': new FormControl(),
      'IdSubModulo': new FormControl(1),
      'IdUsuario': new FormControl(this.json_usuario.ID),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl('a'),
      'Observaciones': new FormControl('a'),
      'Imagen': new FormControl(),
    });
  }

  initFormFilterGroup() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  obtenerMesas() {
    this._cortadoresService.listMesas(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (defectos: any) => {
          console.log(defectos);
          if (defectos.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.mesas = defectos.Vst_Cortadores;
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

  getDetalle(defecto) {
    this.reset();
    this._cortadoresService.getMesa(defecto.ID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.form.patchValue(res.Vst_Cortador);
        }
      );
  }

  GetEnabledMesa(mesa) {
    const options = {
      text: '¿Estas seguro de modificar esta mesa?',
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
          this._cortadoresService.inactivaActivaMesa(mesa.ID)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Mesa actualizada con exito', '');
                this.obtenerMesas();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
    $.ajax({
      url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaMesa?IdMesa=' + $('#HDN_ID').val(),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        if (json.Message.IsSuccessStatusCode) {
          $('#modalEnableMesa').modal('close');
        }
      },
      error: function () {
        console.log('No se pudo establecer coneción a la base de datos');
      }
    });
    this.obtenerMesas();
  }

  NewMesa() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de mesa', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de mesa', '');
    } else {
      this._cortadoresService.validaMesaExiste(this.form.get('Clave').value, this.form.get('Nombre').value)
        .subscribe(
          (existe: any) => {
            if (!existe.Hecho) {
              this._cortadoresService.createMesa(this.form.value)
                .subscribe(
                  (res: any) => {
                    console.log(res);
                    if (res.Message.IsSuccessStatusCode) {
                      this._toast.success('Se agrego correctamente la mesa', '');
                      $('#modalNewMesa').modal('close');
                      this.obtenerMesas();
                    } else {
                      this._toast.warning('Algo salio mal', '');
                    }
                  },
                  error => {
                    console.log(error);
                    this._toast.error('No se pudo establecer conexión a la base de datos', '');
                  });
            } else {
              this._toast.warning('Ya existe un registro con esa clave y/o nombre', '');
            }
          });
    }
  }

  EditMesa() {
    if ($('#CVE_EDT_MESA').val() === '') {
      this._toast.warning('Se debe ingresar una clave de cortador de mesa', '');
    } else if ($('#NOMBRE_EDT_MESA').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de cortador de mesa', '');
    } else {
      this._cortadoresService.validaMesaExiste(this.form.get('Clave').value, this.form.get('Nombre').value, this.form.get('ID').value)
        .subscribe(
          (existe: any) => {
            if (!existe.Hecho) {
              this._cortadoresService.updateMesa(this.form.value)
                .subscribe(
                  (res: any) => {
                    console.log(res);
                    if (res.Message.IsSuccessStatusCode) {
                      this._toast.success('Se actualizo correctamente la mesa', '');
                      $('#modalEditMesa').modal('close');
                      this.reset();
                      this.obtenerMesas();
                    } else {
                      this._toast.warning('Algo salio mal', '');
                    }
                  },
                  error => {
                    console.log(error);
                    this._toast.error('No se pudo establecer conexión a la base de datos', '');
                  });
            } else {
              this._toast.warning('Ya existe un registro con esa clave y/o nombre', '');
            }
          });
    }
  }

  eliminar(defecto) {
    console.log('eliminar: ', defecto);
    swal({
      text: '¿Estas seguro de eliminar esta mesa?',
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
          this._cortadoresService.deleteMesa(defecto.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Mesa eliminada con exito', '');
                  this.obtenerMesas();
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
