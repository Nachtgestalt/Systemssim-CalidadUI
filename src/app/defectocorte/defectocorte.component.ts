import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import swal from 'sweetalert';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {CorteService} from '../services/corte/corte.service';

declare var $: any;

@Component({
  selector: 'app-defectocorte',
  templateUrl: './defectocorte.component.html',
  styleUrls: ['./defectocorte.component.css']
})
export class DefectocorteComponent implements OnInit, OnDestroy, AfterViewInit {
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
  selectedFile;
  selectedFileEdit;
  noMostrar = true;
  defectos = [];
  dtTrigger: Subject<any> = new Subject();

  form: FormGroup;
  formFilter: FormGroup;
  constructor(
    private _cortadoresService: CorteService,
    private _toast: ToastrService
  ) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoCortador').modal();
    $('#modalEditDefectoCortador').modal();
    $('#modalEnableDefectoCortador').modal();
    $('#lblModulo').text('Corte - Defectos');
    this.initFormFilterGroup();
    this.initFormGroup();
    this.obtenerDefectos();
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

  obtenerDefectos() {
    this._cortadoresService.listDefectos(this.formFilter.controls['Clave'].value, this.formFilter.controls['Nombre'].value)
      .subscribe(
        (defectos: any) => {
          console.log(defectos);
          if (defectos.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = defectos.Vst_Cortadores;
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
    this._cortadoresService.getDefecto(defecto.ID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.form.patchValue(res.Vst_Cortador);
          this.selectedFileEdit = this.form.controls['Imagen'].value;
          if (this.selectedFileEdit) {
            this.noMostrar = true;
          }
        }
      );
  }

  GetEnabledDefectoCortador(defecto) {
    const options = {
      text: '¿Estas seguro de modificar este defecto?',
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
          this._cortadoresService.inactivaActivaDefecto(defecto.ID)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Defecto actualizado con exito', '');
                this.obtenerDefectos();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
  }

  NewDefectoCortador() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    } else {
      this._cortadoresService.createDefecto(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se agrego correctamente el defecto', '');
              $('#modalNewDefectoCortador').modal('close');
              this.reset();
              this.obtenerDefectos();
            } else {
              this._toast.warning('Algo salio mal', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          });
    }
  }

  EditDefectoCortador() {
    if ($('#CVE_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto cortador', '');
    } else if ($('#NOMBRE_EDT_DEFECTO').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto cortador', '');
    } else {
      this._cortadoresService.updateDefecto(this.form.value)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se actualizo correctamente el defecto', '');
              $('#modalEditDefectoCortador').modal('close');
              this.reset();
              this.obtenerDefectos();
            } else {
              this._toast.warning('Algo salio mal', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          });
    }
  }

  eliminar(defecto) {
    console.log('eliminar: ', defecto);
    swal({
      text: '¿Estas seguro de eliminar este defecto?',
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
          this._cortadoresService.deleteDefecto(defecto.ID)
            .subscribe(
              (res: any) => {
                console.log(res);
                if (res.Message.IsSuccessStatusCode) {
                  this._toast.success('Defecto eliminado con exito', '');
                  this.obtenerDefectos();
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
    this.noMostrar = false;
    this.selectedFile = null;
  }

  processFile(imageInput: any, nuevo: boolean) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = event.target.result;
      // this.selectedFile.pending = true;
      nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.form.get('Imagen').patchValue(event.target.result);
      this.noMostrar = false;
    });

    reader.readAsDataURL(file);
  }

}
