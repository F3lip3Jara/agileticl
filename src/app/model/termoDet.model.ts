export class TermoDet {

    public idTer       : number;
    public terdEst     : string;
    public terdHorIni  : string;   
    public terdObs     : string;
    public terdLotExt  : string;
    public peso        : string;
    public ancho       : string;
    public espesor     : string;
    public terdTem     : number;
    public terdPesoUn  : number;
    public terdCaja    : number;
    public terdTipo    : string;


   constructor(idTer:number,  terdEst:string ,  terdHorIni:string, 
               terdObs : string , terdLotExt:string , peso  : string ,
               ancho : string , espesor:string , terdTem: number , 
               terdPesoUn: number , terdCaja: number , terdTipo:string){

     this.idTer       =  idTer;
     this.terdEst     =  terdEst;
     this.terdHorIni  =  terdHorIni;
     this.terdObs     =  terdObs;
     this.terdLotExt  =  terdLotExt;
     this.peso        =  peso;
     this.ancho       =  ancho;
     this.espesor     =  espesor;
     this.terdCaja    =  terdCaja;
     this.terdPesoUn  =  terdPesoUn;
     this.terdTem     =  terdTem;
     this.terdTipo    =  terdTipo;

   }



 }
