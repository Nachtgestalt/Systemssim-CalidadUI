import { Globals } from './../Globals';
import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;
import { ToastrService } from 'ngx-toastr';
import 'jquery';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private _toast: ToastrService,
    private router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
  LogIn() {
    if ($('#USU_USERNAME').val() === '') {
      this._toast.warning('Ingresa tu Usuario', '');
    } else if ($('#USU_PASSWORD').val() === '') {
      this._toast.warning('Ingresa tu contraseña', '');
    } else {
      let _Mensaje = '';
      document.getElementById('barProgress').style.display = 'block';
      // REALIZA LA PETICION AL SERIVICIO
      // $.ajax({
      //   url: Globals.UriRioSulApi + 'LogIn/IniciaSesion',
      //   type: 'POST',
      //   contentType: 'application/json; charset=utf-8',
      //   data: JSON.stringify({
      //     Usuario: $('#USU_USERNAME').val(),
      //     Contrasena: $('#USU_PASSWORD').val()
      //   }),
      //   async: false,
      //   success: function(json) {
      //     if (
      //       json.Message.StatusCode === 'OK' ||
      //       json.Message.StatusCode === 200
      //     ) {
      //       $('#formLogOut').css('display', 'block');
      //       sessionStorage.setItem('currentUser', JSON.stringify(json.Usuario));
      //       sessionStorage.setItem('currentMenu', JSON.stringify(json.PER));
      //     } else if (
      //       json.Message.StatusCode === 204 ||
      //       json.Message.StatusCode === 'NoContent'
      //     ) {
      //       _Mensaje = 'Verifica tu usuario y contraseña';
      //       document.getElementById('barProgress').style.display = 'none';
      //     } else {
      //       _Mensaje = 'No se pudo establecer conexión a la base de datos';
      //       document.getElementById('barProgress').style.display = 'none';
      //     }
      //   },
      //   headers: {
      //     'Access-Control-Allow-Origin': '*',
      //     'Access-Control-Allow-Headers': '*',
      //     'Access-Control-Allow-Methods': '*'
      //   },
      //   error: function() {
      //     _Mensaje = 'No se pudo establecer conexión a la base de datos';
      //     document.getElementById('barProgress').style.display = 'none';
      //   }
      // });
      // if (_Mensaje !== '') {
      //   this._toast.warning(_Mensaje, '');
      // }
      // if (sessionStorage.getItem('currentUser') !== null && sessionStorage.getItem('currentUser') !== '') {
      //   this.router.navigate(['home']);
      // }
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {}
}
