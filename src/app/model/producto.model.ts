
export class Producto {

  public prdId: number;
  public prdDes: string;
  public prdCod: string;
  public prdObs: string;
  public prdRap: string;
  public prdEan: number;
  public prdTip: string;
  public prdCost: any;
  public prdNet: any ;
  public prdBrut: any;
  public prdInv: string;
  public prdPes: number;
  public prdMin: number;
  public grpId: number;
  public grpsId: number;
  public colId: number;
  public monId: number;
  public unId : number;


 constructor( prdId: number,
  prdDes: string,
  prdCod: string,
  prdObs: string,
  prdRap: string,
  prdEan: number,
  prdTip: string,
  prdCost: any,
  prdNet: any,
  prdBrut: any,
  prdInv: string,
  prdPes: number,
  prdMin: number,
  grpId: number,
  grpsId: number,
  colId: number,
  monId: number,
  unId: number){

    this.prdId = prdId ;
    this.prdDes = prdDes ;
    this.prdCod = prdCod;
    this.prdObs = prdObs;
    this.prdRap = prdRap ;
    this.prdEan = prdEan;
    this.prdTip = prdTip;
    this.prdCost =prdCost ;
    this.prdNet =prdNet ;
    this.prdBrut =prdBrut ;
    this.prdInv = prdInv;
    this.prdPes = prdPes;
    this.prdMin =prdMin ;
    this.grpId =grpId ;
    this.grpsId = grpsId;
    this.colId = colId;
    this.monId = monId;
    this.unId  = unId;

  }

  public getprdId() {
    return this.prdId;
  }

  public setprdId(prdId : number) {
    this.prdId = prdId ;
  }

  public  getprdDes() {
    return this.prdDes;
  }

  public  setprdDes(prdDes: string) {
    this.prdDes = prdDes ;
  }

  public  getprdCod(prdCod : string) {
    return this.prdCod;
  }

  public  setprdCod(prdCod : string) {
    this.prdCod = prdCod;
  }



  public  getprdObs() {
    return this.prdObs;
  }

  public  setprdObs(prdObs : string) {
    this.prdObs = prdObs;
  }

  public  getprdRap(prdRap : string) {
    return this.prdRap;
  }

  public  setprdRap(prdRap : string) {
    this.prdRap = prdRap ;
  }

  public  getprdEan() {
    return this.prdEan;
  }

  public  setprdEan(prdEan : number) {
    this.prdEan = prdEan;
  }

  public  getprdTip() {
    return this.prdTip;
  }

  public  setprdTip(prdTip : string) {
    this.prdTip = prdTip;
  }

  public  getprdCost() {
    return this.prdCost;
  }

  public  setprdCost(prdCost : any) {
    this.prdCost =prdCost ;
  }

  public  getprdNet() {
    return this.prdNet;
  }

  public  setprdNet(prdNet : any) {
    this.prdNet =prdNet ;
  }

  public  getprdBrut() {
    return this.prdBrut;
  }

  public  setprdBrut(prdBrut : any) {
    this.prdBrut =prdBrut ;
  }

  public  getprdInv() {
    return this.prdInv;
  }

  public  setprdInv(prdInv : string) {
    this.prdInv = prdInv;
  }

  public  getprdPes(prdPes : number) {
    return this.prdPes;
  }

  public  setprdPes(prdPes : number) {
    this.prdPes = prdPes;
  }

  public  getprdMin() {
    return this.prdMin;
  }

  public  setprdMin(prdMin : number) {
    this.prdMin =prdMin ;
  }

  public  getgrpId() {
    return this.grpId;
  }

  public  setgrpId(grpId : number) {
    this.grpId =grpId ;
  }

  public  getgrpsId() {
    return this.grpsId;
  }

  public  setgrpsId(grpsId : number) {
    this.grpsId = grpsId;
  }

  public  getcolId() {
    return this.colId;
  }

  public  setcolId(colId : number) {
    this.colId = colId;
  }

  public  getmonId() {
    return this.monId;
  }

  public  setmonId(monId : number) {
    this.monId = monId;
  }

  public  getunId() {
    return this.unId;
  }

  public  setunId(unId : number) {
    this.unId = unId;
  }




  }
