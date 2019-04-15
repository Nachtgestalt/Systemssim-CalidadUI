import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

declare var $: any;
declare var M: any;
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {LavanderiaService} from '../services/lavanderia/lavanderia.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import swal from 'sweetalert';
import {ProcesosEspecialesService} from '../services/procesos-especiales/procesos-especiales.service';

@Component({
  selector: 'app-lavanderiadefectos',
  templateUrl: './lavanderiadefectos.component.html',
  styleUrls: ['./lavanderiadefectos.component.css']
})
export class LavanderiadefectosComponent implements OnInit, OnDestroy, AfterViewInit {
  private json_usuario = JSON.parse(sessionStorage.getItem('currentUser'));

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  defectos = [];
  selectedFile;
  selectedFileEdit;
  noMostrar = true;

  formEdit: FormGroup;

  clave = '';
  nombre = '';

  optionModule = [
    {value: true, viewValue: 'LAVANDERIA'},
    {value: false, viewValue: 'PROCESOS ESPECIALES'}
  ];

  constructor(
    private _toast: ToastrService,
    private _procesosService: ProcesosEspecialesService,
    private _lavanderiaService: LavanderiaService
  ) {
  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        // pageLength: 6,
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
    $('#modalNewDefectoLavanderia').modal();
    $('#modalEditDefectoLavanderia').modal();
    $('#modalEnableDefectoLavanderia').modal();
    $('#lblModulo').text('Lavandería - Defectos');
    this.initFormGroupEdit();
    this.obtenerDefectos();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  initFormGroupEdit() {
    this.formEdit = new FormGroup({
      'ID': new FormControl(),
      'IdUsuario': new FormControl(),
      'IdSubModulo': new FormControl(),
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(''),
      'Observaciones': new FormControl(''),
      'Imagen': new FormControl(),
      'Tipo': new FormControl(true)
    });
  }

  obtenerDefectos() {
    console.log(this.clave, this.nombre);
    this._lavanderiaService.listDefectos(this.clave, this.nombre)
      .subscribe(
        (res: any) => {
          if (res.Message.IsSuccessStatusCode) {
            console.log(res);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = res.Vst_Lavanderia.concat(res.Vst_ProcesosEspeciales);
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexion a la base de datos', '');
        }
      );
  }

  GetEnabledDefectoLavanderia(defecto) {
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
          if (defecto.IdSubModulo === 17) {
            this._lavanderiaService.inactivaActivaDefecto(defecto.ID)
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
          } else if (defecto.IdSubModulo === 27) {
            this._procesosService.inactivaActivaDefecto(defecto.ID)
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
        }
      });
  }

  NewDefectoLavanderia() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    } else {
      const body = {
        IdSubModulo: 17,
        IdUsuario: this.json_usuario.ID,
        Clave: this.formEdit.controls['Clave'].value,
        Nombre: this.formEdit.controls['Nombre'].value,
        Descripcion: '',
        Observaciones: '',
        Imagen: this.formEdit.controls['Imagen'].value
      };
      if (this.formEdit.controls['Tipo'].value) {
        body.IdSubModulo = 17;
        this._lavanderiaService.createDefecto(body).subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se agrego correctamente el defecto', '');
              $('#modalNewDefectoLavanderia').modal('close');
              this.resetModalEdit();
              this.obtenerDefectos();
            } else {
              this._toast.warning('Algo salio mal', '');
            }
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
      } else {
        console.log('Aun no disponible');
        body.IdSubModulo = 27;
        this._procesosService.createDefecto(body).subscribe(
          (res: any) => {
            console.log(res);
            if (res.Message.IsSuccessStatusCode) {
              this._toast.success('Se agrego correctamente el defecto', '');
              $('#modalNewDefectoLavanderia').modal('close');
              this.resetModalEdit();
              this.obtenerDefectos();
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
  }

  EditDefectoLavanderia() {
    if (this.formEdit.controls['IdSubModulo'].value === 17) {
      this._lavanderiaService.updateDefecto(this.formEdit.value)
        .subscribe(
          res => {
            console.log(res);
            this._toast.success('Defecto actualizado con exito', '');
            this.obtenerDefectos();
            this.resetModalEdit();
            $('#modalEditDefectoLavanderia').modal('close');
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    } else if (this.formEdit.controls['IdSubModulo'].value === 27) {
      this._procesosService.updateDefecto(this.formEdit.value)
        .subscribe(
          res => {
            console.log(res);
            this._toast.success('Defecto actualizado con exito', '');
            this.obtenerDefectos();
            this.resetModalEdit();
            $('#modalEditDefectoLavanderia').modal('close');
          },
          error => {
            console.log(error);
            this._toast.error('No se pudo establecer conexión a la base de datos', '');
          }
        );
    }
  }

  editDefecto(defecto) {
    console.log(defecto);
    this.formEdit.patchValue(defecto);
    console.log('VALOR DEL FORM: ', this.formEdit.value);
    this.selectedFileEdit = defecto.Imagen;
    if (this.selectedFileEdit) {
      this.noMostrar = true;
    }
    setTimeout(() => M.updateTextFields(), 100);
  }

  eliminar(defecto) {
    const options = {
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
    };
    swal(options).then((willDelete) => {
      if (willDelete) {
        if (defecto.IdSubModulo === 17) {
          this._lavanderiaService.deleteDefecto(defecto.ID, 'Defecto')
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
        } else if (defecto.IdSubModulo === 27) {
          this._procesosService.deleteDefecto(defecto.ID, 'Defecto')
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
      }
    });
  }

  resetModalEdit() {
    this.initFormGroupEdit();
    this.selectedFileEdit = null;
    this.selectedFile = null;
    this.noMostrar = false;
  }

  DisposeNewDefectoLavanderia() {
    $('#CVE_NEW_CORTADOR').val('');
    $('#NOMBRE_NEW_CORTADOR').val('');
    $('#DESCRIPCION_NEW_CORTADOR').val('');
    $('#OBSERVACIONES_NEW_CORTADOR').val('');
    $('#blah')[0].src = 'http://placehold.it/180';
  }

  processFile(imageInput: any, nuevo: boolean) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = event.target.result;
      // this.selectedFile.pending = true;
      nuevo ? this.formEdit.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
      this.noMostrar = false;
    });

    reader.readAsDataURL(file);
  }
}
