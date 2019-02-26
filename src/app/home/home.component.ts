import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var jQuery: any;
import 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _route: Router) { }

  ngOnInit() {
    $('#lblModulo').text('Inicio');
    const _json = JSON.parse(sessionStorage.getItem('currentMenu'));
    const _jsonUsuario = JSON.parse(sessionStorage.getItem('currentUser'));

    $('#USU_SPN_CORREO').text(_jsonUsuario.Email);
    $('#USU_SPN_NOMBRE').text(_jsonUsuario.Nombre);

    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();

    for (let i = 0; i < _json.length; i++) {
      $('#menu_' + _json[i].PerGral.PantallaOperacionID).css('display', 'block');
      const _menu_ = $('#menu_' + _json[i].PerGral.PantallaOperacionID).parent()[0].getElementsByTagName('div');
      for (let m = 0; m < _menu_.length; m++) {
        if (_menu_[m].id !== ('menu_' + _json[i].PerGral.PantallaOperacionID) ) {
          $('#menu_' + _menu_[m].id).css('display', 'none');
        }
      }

      for (let j = 0; j < _json[i].Per.length; j++) {
        document.getElementById('menu_' + _json[i].Per[j].PantallaOperacionID).style.display = 'block';
      }

      for (let k = 0; k < _menu_.length; k++) {
        if (_menu_[k].style.display === 'none') {
          $('#' + _menu_[k].id).html('');
        }
      }
    }
    /*$('#lblModulo').text('Inicio');
    const _json = JSON.parse(sessionStorage.getItem('currentMenu'));
    const _jsonUsuario = JSON.parse(sessionStorage.getItem('currentUser'));

    $('#USU_SPN_CORREO').text(_jsonUsuario.Email);
    $('#USU_SPN_NOMBRE').text(_jsonUsuario.Nombre);

    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();

    for (let i = 0; i < _json.length; i++) {
      $('#menu_' + _json[i].PerGral.PantallaOperacionID).css('display', 'block');
      const _menu_ = $('#menu_' + _json[i].PerGral.PantallaOperacionID).parent()[0].getElementsByTagName('div');
      for (let m = 0; m < _menu_.length; m++) {
        if (_menu_[m].id !== ('menu_' + _json[i].PerGral.PantallaOperacionID) ) {
          $('#menu_' + _menu_[m].id).css('display', 'none');
        }
      }

      for (let j = 0; j < _json[i].Per.length; j++) {
        document.getElementById('menu_' + _json[i].Per[j].PantallaOperacionID).style.display = 'block';
      }

      for (let k = 0; k < _menu_.length; k++) {
        if (_menu_[k].style.display === 'none') {
          $('#' + _menu_[k].id).html('');
        }
      }
    }*/
    // for (let i _json[i].Per 0; i < _json.length; i++) {
    //   $('#menu_' + _json[i].PerGral.PantallaOperacionID).css('display', 'block');
    //   const _menu_ = $('#menu_' + _json[i].PerGral.PanallaOperacionID).parent()[0].getElementsByTagName('div');
    //   for (let m = 0; m < _menu_.length; m++) {
    //     if (_menu_[m].id !== ('menu_' + _json[i].PerGral.ID)) {
    //       document.getElementById(_menu_[m].id).style.display = 'none';
    //     }
    //   }
    //   for (let j = 0; j < _json[i].Per.length; j++) {
    //     $('#menu_' + _json[i].Per[j].PantallaOperacionID).css('display', 'block');
    //   }
    //   for (let k = 0; k < _menu_.length; k++) {
    //     if (_menu_[k].style.display === 'none') {
    //       $('#' + _menu_[k].id).html('');
    //     }
    //   }
    // }
  }

}
