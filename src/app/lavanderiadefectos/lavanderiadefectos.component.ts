import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Globals} from '../Globals';

declare var $: any;
declare var jQuery: any;
declare var M: any;
import 'jquery';
import {ToastrService} from '../../../node_modules/ngx-toastr';
import {LavanderiaService} from '../services/lavanderia/lavanderia.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-lavanderiadefectos',
  templateUrl: './lavanderiadefectos.component.html',
  styleUrls: ['./lavanderiadefectos.component.css']
})
export class LavanderiadefectosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();

  defectos = [];
  selectedFile;
  selectedFileEdit;
  noMostrar = true;

  form: FormGroup;
  formEdit: FormGroup;

  constructor(
    private _toast: ToastrService,
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
    this.GetDefectosLavanderia();
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
      'Clave': new FormControl(),
      'Nombre': new FormControl(),
      'Descripcion': new FormControl(),
      'Observaciones': new FormControl(),
      'Imagen': new FormControl(),
    });
  }

  GetDefectosLavanderia() {
    let _request = '';
    if ($('#CLAVE_CORTADOR').val() !== '' && $('#NOMBRE_CORTADOR').val() === '') {
      _request += '?Clave=' + $('#CLAVE_CORTADOR').val();
    } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_CORTADOR').val() === '') {
      _request += '?Nombre=' + $('#NOMBRE_CORTADOR').val();
    } else {
      _request += '?Nombre=' + $('#NOMBRE_CORTADOR').val() + '?Clave=' + $('#CLAVE_CORTADOR').val();
    }
    console.log(_request);
    this._lavanderiaService.listDefectos()
      .subscribe(
        (res: any) => {
          if (res.Message.IsSuccessStatusCode) {
            console.log(res);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = res.Vst_Lavanderia;
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

  GetEnabledDefectoLavanderia(id) {
    let options = {
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
          this._lavanderiaService.inactivaActivaDefecto(id)
            .subscribe(
              res => {
                console.log(res);
                this._toast.success('Defecto actualizado con exito', '');
                this.GetDefectosLavanderia();
              },
              error => {
                console.log(error);
                this._toast.error('No se pudo establecer conexión a la base de datos', '');
              }
            );
        }
      });
  }

  NewDefectoLavanderia() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto cortador', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto cortador', '');
    } else if ($('#OBSERVACIONES_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar las observaciones del defecto cortador', '');
    } else {
      let Result = false;
      $.ajax({
        // tslint:disable-next-line:max-line-length
        url: Globals.UriRioSulApi + 'Lavanderia/ValidaLavanderiaSubModulo?SubModulo=17&Clave=' + $('#CVE_NEW_CORTADOR').val() + '&Nombre=' + $('#NOMBRE_NEW_CORTADOR').val(),
        dataType: 'json',
        contents: 'application/json; charset=utf-8',
        method: 'get',
        async: false,
        success: function (json) {
          if (json.Message.IsSuccessStatusCode) {
            Result = json.Hecho;
          }
        },
        error: function () {
          console.log('No se pudo establecer conexión a la base de datos');
        }
      });
      if (Result) {
        let Mensaje = '';
        const Json_Usuario = JSON.parse(sessionStorage.getItem('currentUser'));
        $.ajax({
          url: Globals.UriRioSulApi + 'Lavanderia/NuevoDefectoLavanderia',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          async: false,
          data: JSON.stringify({
            IdSubModulo: 1,
            IdUsuario: Json_Usuario.ID,
            Clave: $('#CVE_NEW_CORTADOR').val(),
            Nombre: $('#NOMBRE_NEW_CORTADOR').val(),
            Descripcion: $('#DESCRIPCION_NEW_CORTADOR').val(),
            Observaciones: $('#OBSERVACIONES_NEW_CORTADOR').val(),
            Imagen: ($('#blah')[0].src === 'http://placehold.it/180' ? '' : $('#blah')[0].src)
          }),
          success: function (json) {
            if (json.Message.IsSuccessStatusCode) {
              Mensaje = 'Se agrego correctamente el defecto';
            }
          },
          error: function () {
            console.log('No se pudo establecer conexión a la base de datos');
          }
        });
        if (Mensaje !== '') {
          this.GetDefectosLavanderia();
          this._toast.success(Mensaje, '');
          $('#modalNewDefectoLavanderia').modal('close');
        }
      } else {
        this._toast.warning('La clave de defecto cortador ya se encuentra registrada en el sistema', '');
      }
    }
  }

  EditDefectoLavanderia() {
    console.log('EDITAR DEFECTO');
    this._lavanderiaService.updateDefecto(this.formEdit.value)
      .subscribe(
        res => {
          console.log(res);
          this._toast.success('Defecto actualizado con exito', '');
          this.GetDefectosLavanderia();
          this.resetModalEdit();
          $('#modalEditDefectoLavanderia').modal('close');
        },
        error => {
          console.log(error);
          this._toast.error('No se pudo establecer conexión a la base de datos', '');
        }
      );
  }

  editDefecto(defecto) {
    console.log(defecto);
    this.formEdit.patchValue(defecto);
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
        this._lavanderiaService.deleteDefecto(defecto.ID, 'Defecto')
          .subscribe(
            (res: any) => {
              console.log(res);
              if (res.Message.IsSuccessStatusCode) {
                this._toast.success('Defecto eliminado con exito', '');
                this.GetDefectosLavanderia();
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
      nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.formEdit.get('Imagen').patchValue(event.target.result);
      this.noMostrar = false;
    });

    reader.readAsDataURL(file);
  }

}

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {
  }
}

