import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminado-posicion',
  templateUrl: './terminado-posicion.component.html',
  styleUrls: ['./terminado-posicion.component.css']
})
export class TerminadoPosicionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#lblModulo').text('Terminado - Posición');
  }

}
