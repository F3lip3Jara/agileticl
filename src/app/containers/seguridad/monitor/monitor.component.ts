import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  monitor(){
    window.open('https://marple.des.app.agileti.cl/telescope', '_blank');
  }

}
