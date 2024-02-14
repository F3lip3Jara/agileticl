import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-info-orden-produccion',
  templateUrl: './info-orden-produccion.component.html',
  styleUrls: ['./info-orden-produccion.component.css']
})
export class InfoOrdenProduccionComponent implements OnInit {

  @Input() orden_trabajo: any;


  constructor() { }

  ngOnInit(): void {
  }

}
