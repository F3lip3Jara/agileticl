export class Proveedor {

  public prvId    : number;
  public prvRut   : string;
  public prvNom   : string;
  public prvNom2  : string;
  public prvGiro  : string;
  public prvDir   : string;
  public prvNum   : string;
  public paiId    : number;
  public regId    : number;
  public comId    : number;
  public ciuId    : number;
  public prvMail  : string;
  public prvTel   : string;
  public prvCli   : any;
  public prvPrv   : any;
  public prvAct   : any;

  constructor(
     prvId     : number,
     prvRut   : string,
     prvNom   : string,
     prvNom2  : string,
     prvGiro  : string,
     prvDir   : string,
     prvNum   : string,
     paiId    : number,
     regId    : number,
     comId    : number,
     ciuId    : number,
     prvMail  : string,
     prvTel   : string,
     prvCli   : any,
     prvPrv   : any,
     prvAct   : any

  ){

    this.prvRut  = prvRut;
    this.prvNom  = prvNom;
    this.prvNom2 = prvNom2;
    this.prvGiro = prvGiro;
    this.prvDir  = prvDir;
    this.prvNum  = prvNum;
    this.paiId   = paiId;
    this.regId   = regId;
    this.comId   = comId;
    this.ciuId   = ciuId;
    this.prvMail = prvMail;
    this.prvTel  = prvTel;
    this.prvCli  = prvCli;
    this.prvPrv  = prvPrv;
    this.prvId   = prvId;
    this.prvAct  = prvAct;
  }

  public getprvId() {
    return this.prvId;
  }

  public  setprvId(prvId : number) {
    this.prvId = prvId;
  }


  public getPrvRut() {
    return this.prvRut;
  }

  public  setPrvRut(prvRut : string) {
    this.prvRut = prvRut;
  }

  public getPrvNom() {
    return this.prvNom;
  }

  public  setPrvNom(prvNom  : string) {
    this.prvNom = prvNom;
  }

  public getPrvNom2() {
    return this.prvNom2;
  }

  public  setPrvNom2(prvNom2 : string) {
    this.prvNom2 = prvNom2;
  }

  public getPrvGiro() {
    return this.prvGiro;
  }

  public  setPrvGiro(prvGiro  : string) {
    this.prvGiro = prvGiro;
  }

  public getPrvDir() {
    return this.prvDir;
  }

  public  setPrvDir(prvDir  : string) {
    this.prvDir = prvDir;
  }

  public getPrvNum() {
    return this.prvNum;
  }

  public  setPrvNum(prvNum  : string) {
    this.prvNum = prvNum;
  }

  public getpaiId() {
    return this.paiId;
  }

  public  setpaiId(paiId : number) {
    this.paiId = paiId;
  }

  public getregId() {
    return this.regId;
  }

  public  setregId(regId : number) {
    this.regId = regId;
  }

  public getcomId() {
    return this.comId;
  }

  public  setcomId(comId : number) {
    this.comId = comId;
  }

  public getciuId() {
    return this.ciuId;
  }

  public  setciuId(ciuId  : number) {
    this.ciuId = ciuId;
  }

  public getPrvMail() {
    return this.prvMail;
  }

  public  setPrvMail(prvMail : string) {
    this.prvMail = prvMail;
  }

  public getPrvTel() {
    return this.prvTel;
  }

  public  setPrvTel(prvTel : string) {
    this.prvTel = prvTel;
  }

  public getPrvCli() {
    return this.prvCli;
  }

  public  setPrvCli(prvCli : any) {
    this.prvCli = prvCli;
  }

  public getPrvPrv() {
    return this.prvPrv;
  }

  public  setPrvPrv(prvPrv : any) {
    this.prvPrv = prvPrv;
  }

  public getPrvAct() {
    return this.prvAct;
  }

  public  setPrvAct(prvAct : any) {
    this.prvAct = prvAct;
  }




}
