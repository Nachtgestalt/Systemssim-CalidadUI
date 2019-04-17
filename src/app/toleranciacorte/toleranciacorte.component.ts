import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {CorteService} from '../services/corte/corte.service';
import {FormControl, FormGroup} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import swal from 'sweetalert';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-toleranciacorte',
  templateUrl: './toleranciacorte.component.html',
  styleUrls: ['./toleranciacorte.component.css']
})
export class ToleranciacorteComponent implements OnInit, OnDestroy, AfterViewInit {
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
  tolerancias = [];
  form: FormGroup;
  formFilter: FormGroup;

  constructor(
    private _cortadoresService: CorteService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('#modalNewTolerancia').modal();
    $('#modalEdtTolerancia').modal();
    $('.tooltipped').tooltip();
    $('#lblModulo').text('Corte - Tolerancia');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerTolerancias();
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
      'IdTolerancia': new FormControl(),
      'IdSubModulo': new FormControl(1),
      'IdUsuario': new FormControl(this.json_usuario.ID),
      'Descripcion': new FormControl(),
      'Numerador': new FormControl(),
      'Denominador': new FormControl(),
      'ToleranciaNegativa': new FormControl(),
      'ToleranciaPositiva': new FormControl()
    });
  }

  initFormFilterGroup() {
    this.formFilter = new FormGroup({
      'Clave': new FormControl(''),
      'Nombre': new FormControl('')
    });
  }

  obtenerTolerancias() {
    this._cortadoresService.listTolerancias(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.tolerancias = res.Tolerancias;
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

  getDetalle(tolerancia) {
    this.reset();
    this.form.patchValue(tolerancia);
    setTimeout(() => M.updateTextFields(), 10);
    // this._cortadoresService.getTolerancia(tolerancia.IdTolerancia)
    //   .subscribe(
    //     (res: any) => {
    //       console.log(res);
    //       this.form.patchValue(tolerancia);
    //     }
    //   );
  }

  DisposeNewTolerancia() {
    $('#TOL_NUMERADOR').val('');
    $('#TOL_DENOMINADOR').val('');
    $('#TOL_DESCRIPCION').val('');
    $('#chkToleranciaNegativa').prop('checked', false);
    $('#chkToleranciaPositiva').prop('checked', false);
  }

  NewTolerancia() {
    if ($('#TOL_NUMERADOR').val() === '') {
      this._toast.warning('Se debe ingresar el númerador de tolerancia', '');
      $('#TOL_NUMERADOR').focus();
    } else if ($('#TOL_DENOMINADOR').val() === '') {
      this._toast.warning('Se debe ingresar el denominador de tolerancia', '');
    } else {
      const body = this.form.value;
      body.Descripcion = +body.Descripcion;
      body.Numerador = +body.Numerador;
      body.Denominador = +body.Denominador;
      this._cortadoresService.validaNuevaTolerancia(body.Descripcion, body.Numerador, body.Denominador)
        .subscribe(
          (result: any) => {
            console.log(result);
            if (result) {
              this._cortadoresService.createTolerancia(body).subscribe(
                (res: any) => {
                  // if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Se agrego correctamente la tolerancia', '');
                  $('#modalNewTolerancia').modal('close');
                  this.obtenerTolerancias();
                  // } else {
                  //   this._toast.warning('Algo salio mal', '');
                  // }
                },
                error => {
                  console.log(error);
                  this._toast.error('No se pudo establecer conexión a la base de datos', '');
                }
              );
            } else {
              this._toast.warning('La combinación registrada ya se encuentra dada de alta', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    }
  }

  editTolerancia() {
    this._cortadoresService.updateTolerancia(this.form.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          // if (res.Message.IsSuccessStatusCode) {
            this._toast.success('Se actualizo correctamente la tolerancia', '');
            $('#modalEdtTolerancia').modal('close');
            this.obtenerTolerancias();
          // } else {
          //   this._toast.warning('Algo salio mal', '');
          // }
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  eliminar(tolerancia) {
    console.log('eliminar: ', tolerancia);
    swal({
      text: '¿Estas seguro de eliminar esta tolerancia?',
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
          this._cortadoresService.deleteTolerancia(tolerancia.IdTolerancia)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Tolerancia eliminada con exito', '');
                  this.obtenerTolerancias();
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
