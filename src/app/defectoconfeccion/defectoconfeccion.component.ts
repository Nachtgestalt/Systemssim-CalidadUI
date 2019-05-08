import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'jquery';
import {ToastrService} from 'ngx-toastr';
import {ConfeccionService} from '../services/confeccion/confeccion.service';
import {FormControl, FormGroup} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-defectoconfeccion',
  templateUrl: './defectoconfeccion.component.html',
  styleUrls: ['./defectoconfeccion.component.css']
})
export class DefectoconfeccionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  private json_usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  dtTrigger: Subject<any> = new Subject();
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

  defectos = [];

  noMostrar = true;
  selectedFile;
  selectedFileEdit;

  form: FormGroup;
  formFilter: FormGroup;

  constructor(
    private _confeccionService: ConfeccionService,
    private _toast: ToastrService
  ) {
  }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewDefectoConfeccion').modal();
    $('#modalEditDefectoConfeccion').modal();
    $('#modalEnableDefectoConfeccion').modal();
    $('#lblModulo').text('Confección - Defectos');
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
      'Nombre': new FormControl(''),
    });
  }

  obtenerDefectos() {
    this._confeccionService.listDefectos(this.formFilter.get('Clave').value, this.formFilter.get('Nombre').value)
      .subscribe(
        (defectos: any) => {
          console.log(defectos);
          if (defectos.Message.IsSuccessStatusCode) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.defectos = defectos.Vst_Confeccion;
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
    // let sOptions = '';
    // let _request = '';
    // if ($('#CLAVE_CORTADOR').val() !== '' && $('#NOMBRE_CORTADOR').val() === '') {
    //   _request += '?Clave=' +  $('#CLAVE_CORTADOR').val();
    // } else if ($('#NOMBRE_CORTADOR').val() !== '' && $('#CLAVE_CORTADOR').val() === '') {
    //   _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val();
    // } else {
    //   _request += '?Nombre=' +  $('#NOMBRE_CORTADOR').val() + '?Clave=' +  $('#CLAVE_CORTADOR').val();
    // }
    // $.ajax({
    //   url: Globals.UriRioSulApi + 'Confeccion/ObtieneDefectoConfeccion' + _request,
    //   dataType: 'json',
    //   contents: 'application/json; charset=utf-8',
    //   method: 'get',
    //   async: false,
    //   success: function (json) {
    //     if (json.Message.IsSuccessStatusCode) {
    //       let index = 1;
    //       for (let i = 0; i < json.Vst_Confeccion.length; i++) {
    //         sOptions += '<tr>';
    //         // tslint:disable-next-line:max-line-length
    //         sOptions += '<td><a onclick="SetId(' + json.Vst_Confeccion[i].ID + '); DisposeEditDefectoConfeccion(); GetInfoDefectoConfeccion();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditDefectoConfeccion" data-position="bottom" data-tooltip="Edita el defecto confección seleccionado"><i class="material-icons right">edit</i></a></td>';
    //         sOptions += '<td>' + index + '</td>';
    //         sOptions += '<td>' + json.Vst_Confeccion[i].Clave + '</td>';
    //         sOptions += '<td>' + json.Vst_Confeccion[i].Nombre + '</td>';
    //         if (json.Vst_Confeccion[i].Activo) {
    //           sOptions += '<td style="text-align: center">SI</td>';
    //         } else {
    //           sOptions += '<td style="text-align: center">NO</td>';
    //         }
    //         if (json.Vst_Confeccion[i].Activo === true) {
    //           // tslint:disable-next-line:max-line-length
    //           sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoConfeccion" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Inactivar</u></strong></a></td>';
    //         } else {
    //           // tslint:disable-next-line:max-line-length
    //           sOptions += '<td style="text-align:center"><a onclick="SetId(' + json.Vst_Confeccion[i].ID + ');" class="waves-effect waves-light btn tooltiped modal-trigger" data-target="modalEnableDefectoConfeccion" data-tooltiped="Activa / Inactiva el cortador seleccionado"><strong><u>Activar</u></strong></a></td>';
    //         }
    //         sOptions += '</tr>';
    //         index ++;
    //       }
    //       $('#tlbDefectoConfeccion').html('');
    //       $('#tlbDefectoConfeccion').html('<tbody>' + sOptions + '</tbody>');
    //       // tslint:disable-next-line:max-line-length
    //       $('#tlbDefectoConfeccion').append('<thead><th></th><th>No.</th><th>Clave Defectos</th><th>Nombre Defectos</th><th>Estatus</th><th></th></thead>');
    //       $('#tlbDefectoConfeccion').DataTable({
    //         sorting: true,
    //         bDestroy: true,
    //         ordering: true,
    //         bPaginate: true,
    //         pageLength: 6,
    //         bInfo: true,
    //         dom: 'Bfrtip',
    //         processing: true,
    //         buttons: [
    //           'copyHtml5',
    //           'excelHtml5',
    //           'csvHtml5',
    //           'pdfHtml5'
    //          ]
    //       });
    //       $('.tooltipped').tooltip();
    //     }
    //   },
    //   error: function () {
    //     console.log('No se pudo establecer coneción a la base de datos');
    //   }
    // });
  }

  getDetalle(defecto) {
    this._confeccionService.getDefecto(defecto.ID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.form.patchValue(res.Vst_Confeccion);
          this.selectedFileEdit = this.form.controls['Imagen'].value;
          if (this.selectedFileEdit) {
            this.noMostrar = true;
          }
        }
      );
  }

  GetEnabledDefectoConfeccion(defecto) {
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
          this._confeccionService.inactivaActivaDefecto(defecto.ID)
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

  NewDefectoConfeccion() {
    if ($('#CVE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar una clave de defecto confección', '');
    } else if ($('#NOMBRE_NEW_CORTADOR').val() === '') {
      this._toast.warning('Se debe ingresar un nombre de defecto confección', '');
    } else {
      this._confeccionService.validaDefectoExiste(this.form.get('Clave').value, this.form.get('Nombre').value)
        .subscribe(
          (existe: any) => {
            console.log(existe);
            if (!existe.Hecho) {
              this._confeccionService.createDefecto(this.form.value)
                .subscribe(
                  (res: any) => {
                    console.log(res);
                    if (res.Message.IsSuccessStatusCode) {
                      this._toast.success('Se agrego correctamente el defecto', '');
                      $('#modalNewDefectoConfeccion').modal('close');
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
            } else {
              this._toast.warning('Ya existe un registro con esa clave y/o nombre', '');
            }
          }
        );
    }
  }

  EditDefectoConfeccion() {
    if ($('#CVE_EDT_DEFECTO_CONFECCION').val() === '') {
      this._toast.warning('Se debe ingresar una clave defecto confección', '');
    } else if ($('#NOMBRE_EDT_DEFECTO_CONFECCION').val() === '') {
      this._toast.warning('Se debe ingresar un nombre defecto confección', '');
    } else {
      this._confeccionService.validaDefectoExiste(this.form.get('Clave').value, this.form.get('Nombre').value, this.form.get('ID').value)
        .subscribe(
          (existe: any) => {
            if (!existe.Hecho) {
              this._confeccionService.updateDefecto(this.form.value)
                .subscribe(
                  (res: any) => {
                    console.log(res);
                    if (res.Message.IsSuccessStatusCode) {
                      this._toast.success('Se actualizo correctamente el defecto', '');
                      $('#modalEditDefectoConfeccion').modal('close');
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
            } else {
              this._toast.warning('Ya existe un registro con esa clave y/o nombre', '');
            }
          }
        );
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
          this._confeccionService.deleteConfeccion(defecto.ID, 'Defecto')
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

  DisposeNewDefectoConfeccion() {
    $('#CLAVE_CORTADOR').val('');
    $('#NOMBRE_CORTADOR').val('');
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
      nuevo ? this.form.get('Imagen').patchValue(event.target.result) : this.form.get('Imagen').patchValue(event.target.result);
      this.noMostrar = false;
    });

    reader.readAsDataURL(file);
  }

  reset() {
    this.initFormGroup();
    this.noMostrar = false;
    this.selectedFile = null;
  }

}
