import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lavanderiaposicion',
  templateUrl: './lavanderiaposicion.component.html',
  styleUrls: ['./lavanderiaposicion.component.css']
})
export class LavanderiaposicionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Lavandería Posición');
  }

}
