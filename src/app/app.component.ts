import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RioSulApp';
  constructor (private _route: Router) { }
  ngOnInit() {
    if (sessionStorage.getItem('currentUser') === null || sessionStorage.getItem('currentUser') === '') {
      $('#formLogOut').css('display', 'none');
      this._route.navigate(['login']);
    } else {
      $('#formLogOut').css('display', 'block');
      this._route.navigate(['home']);
    }
  }
}
