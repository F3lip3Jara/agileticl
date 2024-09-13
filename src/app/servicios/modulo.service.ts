import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  @Output() disparador     :EventEmitter <any> = new EventEmitter(); 

  optAsig : any  = [];
  rolAsig : any  = [];
  optnAsig : any  = [];
  rolnAsig : any  = [];

  
  constructor() {


   }

setRolAsig(rolAsig: any){
    this.rolAsig = rolAsig;
}

setRolnAsig(rolnAsig: any){
    this.rolnAsig = rolnAsig;
}

getRolnAsig(){
    return this.rolnAsig;
}

getRolAsig(){
    return this.rolAsig;
}

setOptAsig(optAsig: any){
    this.optAsig = optAsig;
}

setOptnAsig(optnAsig: any){
    this.optnAsig = optnAsig;
}

getOptAsig(){
    return this.optAsig;
}

getOptnAsig(){
    return this.optnAsig;
}

clear(){
  this.optAsig   = [];
  this.rolAsig   = [];
  this.optnAsig  = [];
  this.rolnAsig  = [];
}
  
}
