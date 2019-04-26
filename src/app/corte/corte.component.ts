import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {CorteService} from '../services/corte/corte.service';
import swal from 'sweetalert';
import {FormControl, FormGroup} from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-corte',
  templateUrl: './corte.component.html',
  styleUrls: ['./corte.component.css']
})
export class CorteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
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

  dtTrigger: Subject<any> = new Subject();

  cortadores = [];

  form: FormGroup;
  formFilter: FormGroup;

  constructor(private _toast: ToastrService,
              private _cortadoresService: CorteService) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewCortador').modal();
    $('#modalEditCortador').modal();
    $('#modalEnableCortador').modal();
    $('#lblModulo').text('Corte - Cortadores');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerCortadores();
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
      'Observaciones': new FormControl('a')
    });
  }

  initFormFilterGroup() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  obtenerCortadores() {
    this._cortadoresService.listCortadores(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
      (cortadores: any) => {
        console.log(cortadores);
        if (cortadores.Message.IsSuccessStatusCode) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.cortadores = cortadores.Vst_Cortadores;
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

  getDetalle(cortador) {
    this.reset();
    this._cortadoresService.getCortador(cortador.ID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.form.patchValue(res.Vst_Cortador);
        }
      );
  }

  GetEnabledCortador(cortador) {
    const options = {
      text: '¿Estas seguro de modificar este cortador?',
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
            this._cortadoresService.inactivaActivaCortador(cortador.ID)
              .subscribe(
                (res: any) => {
                  // console.log(res);
                  if (res.Message.IsSuccessStatusCode) {
                    this._toast.success('Cortador actualizado con exito', '');
                    this.obtenerCortadores();
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
    // $.ajax({
    //   url: Globals.UriRioSulApi + 'Cortadores/ActivaInactivaCortador?Idcortador=' + $('#HDN_ID').val(),
    //   dataType: 'json',
    //   contents: 'application/json; charset=utf-8',
    //   method: 'get',
    //   async: false,
    //   success: function (json) {
    //     if (json.Message.IsSuccessStatusCode) {
    //       $('#modalEnableCortador').modal('close');
    //     }
    //   },
    //   error: function () {
    //     console.log('No se pudo establecer coneción a la base de datos');
    //   }
    // });
    // this.obtenerCortadores();
  }

  NewCortador() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de cortador', '');
    } else {
      this._cortadoresService.createCortador(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se agrego correctamente el cortador', '');
              $('#modalNewCortador').modal('close');
              this.obtenerCortadores();
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

  editCortador() {
    if ($('#CVE_EDT_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de cortador', '');
    } else if ($('#NOMBRE_EDT_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de cortador', '');
    } else {
      this._cortadoresService.updateCortador(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se actualizo correctamente el cortador', '');
              $('#modalEditCortador').modal('close');
              this.obtenerCortadores();
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
      text: '¿Estas seguro de eliminar este cortador?',
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
                  this._toast.success('Cortador eliminado con exito', '');
                  this.obtenerCortadores();
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
