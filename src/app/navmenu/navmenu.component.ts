import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
declare var jQuery: any;
import 'jquery';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  constructor(private _route: Router) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
  }

  public LogOut() {
    sessionStorage.setItem('currentUser', '');
    this._route.navigate(['login']);
  }
}
