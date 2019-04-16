import {Globals} from '../Globals';
import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';

declare var $: any;
import 'jquery';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(
    private _toast: ToastrService,
  ) {}

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('#modalNewUser').modal();
    $('#modalEnableUser').modal();
    $('#modalEditUser').modal();
    $('#lblModulo').text('Catálogo de Usuarios');
    this.GetUsers();
  }

  GetUsers() {
    let Request = '';
    if ($('#USU_BUSQUEDA_NOMBRE').val() !== '') {
      Request += '&Nombre=' + $('#USU_BUSQUEDA_NOMBRE').val();
    }
    if ($('#USU_BUSQUEDA_USERNAME').val() !== '') {
      Request += '&Usuario=' + $('#USU_BUSQUEDA_USERNAME').val();
    }
    Request += '&Email=' + $('#USU_BUSQUEDA_EMAIL').val();
    if ($('#USU_BUSQUEDA_EMAIL').val() !== '') {
    }
    $.ajax({
      url: Globals.UriRioSulApi + 'Usuario/GetUsers?Key=' + atob(Globals.PasswordKey) + Request,
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        let sOptions = '';
        let Index = 1;
        let i: number;
        for (i = 0; i < json.Usuarios.length; i++) {
          sOptions += '<tr>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td><a onclick="SetId(' + json.Usuarios[i].ID + ');GetPermits();" class="waves-effect waves-light btn tooltipped modal-trigger" data-target="modalEditUser" data-position="bottom" data-tooltip="Edita el usuario seleccionado"><i class="material-icons right">edit</i></a></td>';
          sOptions += '<td>' + Index + '</td>';
          if (json.Usuarios[i].Activo === true) {
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="SetId(' + json.Usuarios[i].ID + ')" class="waves-effect waves-green btn-flat modal-trigger" data-target="modalEnableUser"><strong><u>Inactivar</u></strong></a></td>';
          } else {
            // tslint:disable-next-line:max-line-length
            sOptions += '<td><a onclick="SetId(' + json.Usuarios[i].ID + ')" class="waves-effect waves-green btn-flat modal-trigger" data-target="modalEnableUser"><strong><u>Activar</u></strong></a></td>';
          }
          sOptions += '<td>' + json.Usuarios[i].Nombre + '</td>';
          sOptions += '<td>' + json.Usuarios[i].Usuario + '</td>';
          sOptions += '<td>' + json.Usuarios[i].Email + '</td>';
          sOptions += '<td>' + (json.Usuarios[i].Activo === true ? 'SI' : 'NO') + '</td>';
          sOptions += '</tr>';
          Index++;
        }
        $('#tlbUsuarios').html('');
        $('#tlbUsuarios').html(sOptions);
        // tslint:disable-next-line:max-line-length
        $('#tlbUsuarios').append('<thead><tr><th></th><th>No.</th><th>Activar/Inactivar</th><th>Nombre</th><th>Usuario</th><th>Email</th><th>Activo</th></tr></thead>');
        $('#tlbUsuarios').DataTable();
        $('.tooltipped').tooltip();
      },
      error: function () {
        console.log('No se pudo establecer conexión con la base de datos');
      }
    });
  }

  AddUser() {
    let _Mensaje = '';
    if ($('#USU_NOMBRE').val() === '') {
      this._toast.warning('Ingresa el nombre completo del usuario', '');
    }

    if ($('#USU_USERNAME').val() === '') {
      this._toast.warning('Infresa un usuario valido', '');
    }

    if ($('#USU_EMAIL').val() === '') {
      this._toast.warning('Ingresa un correo electrónico valido', '');
    }

    if ($('#USU_PASSWORD').val() === '') {
      this._toast.warning('Ingresa una contraseña valida', '');
    } else {
      const Pass_Len: string = $('#USU_PASSWORD').val();
      if (Pass_Len.length <= 5) {
        this._toast.warning('La longitud de la contraeña debe ser mayor a 5 caracteres', '');
      } else if ($('#USU_PASSWORD').val() !== $('#USU_PASSWORD_VERIFICA').val()) {
        this._toast.warning('Debe ser la misma contraseña en los campos Contraseña', '');
      } else {
        $.ajax({
          url: Globals.UriRioSulApi + 'Usuario/NewUser',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({
            'Usuario': {
              'Nombre': $('#USU_NOMBRE').val(),
              'Usuario': $('#USU_USERNAME').val(),
              'Contraseña': $('#USU_PASSWORD').val(),
              'Email': $('#USU_EMAIL').val()
            },
            'PerMenu': $('#HDN_ARR').val()
          }),
          async: false,
          success: function (json) {
            if (json.Message.StatusCode === 'OK' || json.Message.StatusCode === 200) {
              _Mensaje = '';
            } else if (json.Message.StatusCode === 'Conflict' || json.Message.StatusCode === 409) {
              _Mensaje = 'El Usuario ya se encuentra registrado, por favor intente con uno nuevo';
            } else {
              _Mensaje = 'No se pudo agregar el usuario';
            }
          },
          error: function () {
            _Mensaje = 'No se pudo establecer conexión a la base de datos';
          }
        });
        if (_Mensaje !== '') {
          this._toast.warning(_Mensaje, '');
        } else {
          this._toast.success('Se agrego correctamente el usuario', '');
          this.DisposeFields();
          this.GetUsers();
          $('#modalNewUser').modal('close');
        }
      }
    }
  }

  DisposeFields() {
    $('#USU_NOMBRE').val('');
    $('#USU_USERNAME').val('');
    $('#USU_PASSWORD').val('');
    $('#USU_EMAIL').val('');
    $('#USU_PASSWORD_VERIFICA').val('');
  }

  EnableDisableUser() {
    let Mensaje = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Usuario/DisableUser?ID_USU=' + ($('#HDN_ID').val()),
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      async: false,
      success: function (json) {
        if (json.Message.StatusCode === 'OK' || json.Message.StatusCode === 200) {
          Mensaje = '';
        } else {
          Mensaje = 'No se pudo actualizar el registro';
        }
      },
      error: function () {
        Mensaje = 'No se pudo establecer conexión a la base de datos';
      }
    });
    if (Mensaje === '') {
      this._toast.success('El usuario se actualizo correctamente', '');
      this.GetUsers();
      $('#modalEnableUser').modal('close');
    } else {
      this._toast.warning(Mensaje, '');
    }
  }

  UpdateUsuario() {
    let Mensaje = '';
    $.ajax({
      url: Globals.UriRioSulApi + 'Usuario/UpdatePermitsByUser',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      async: false,
      data: JSON.stringify({
        Key: atob(Globals.PasswordKey),
        Usuario: {
          UsuId: $('#HDN_ID').val(),
          Nombre: $('#USU_NOMBRE_EDT').val(),
          Usuario: $('#USU_USERNAME_EDT').val(),
          'Contraseña': $('#USU_PASSWORD_EDT').val(),
          Email: $('#USU_EMAIL_EDT').val()
        },
        PerMenu: $('#HDN_ARR').val()
      }),
      success: function (json) {

      },
      error: function () {
        Mensaje = 'No se pudo establecer conexión a la base de datos';
      }
    });
    if (Mensaje === '') {
      this._toast.success('El usuario se actualizo correctamente', '');
      $('#modalEditUser').modal('close');
    } else {
      this._toast.warning(Mensaje, '');
    }
  }

  OpenModalNewUser() {
    $.ajax({
      url: Globals.UriRioSulApi + 'Usuario/GetMenus?Key=' + atob(Globals.PasswordKey),
      dataType: 'json',
      contents: 'application/json; charset=utf-8',
      method: 'get',
      async: false,
      success: function (json) {
        let sOptions = '';
        let i: number;
        let Modulo = '';
        for (i = 0; i < json.Menus.length; i++) {
          Modulo = (json.Menus[i].Pantalla === null ? json.Menus[i].SubMenu : json.Menus[i].Pantalla);
          sOptions += '<tr id="' + json.Menus[i].ID + '">';
          sOptions += '<td>' + Modulo + '</td>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td style="text-align: center"><label><input id="' + json.Menus[i].ID + '_1" type="checkbox" class="filled-in"><span></span></label></td>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td style="text-align: center"><label><input id="' + json.Menus[i].ID + '_2" type="checkbox" class="filled-in"><span></span></label></td>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td style="text-align: center"><label><input id="' + json.Menus[i].ID + '_3" type="checkbox" class="filled-in"><span></span></label></td>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td style="text-align: center"><label><input id="' + json.Menus[i].ID + '_4" type="checkbox" class="filled-in"><span></span></label></td>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td style="text-align: center"><label><input id="' + json.Menus[i].ID + '_5" type="checkbox" class="filled-in"><span></span></label></td>';
          // tslint:disable-next-line:max-line-length
          sOptions += '<td style="text-align: center"><label><input id="' + json.Menus[i].ID + '_6" type="checkbox" class="filled-in"><span></span></label></td>';
          sOptions += '</tr>';
        }
        $('#tbodyMenu').html('');
        $('#tbodyMenu').html(sOptions);
      },
      error: function () {
        console.log('No se pudo establecer conexión a la base de datos');
      }
    });
  }
}
