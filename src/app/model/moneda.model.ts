export class Moneda {

  public  monId     :number;
  public  monDes    :string;
  public  monCod    :string;


  constructor(xid :number , xmonDes: string , xmonCod : string  ) {
     this.monId       = xid;
     this.monDes      = xmonDes;
     this.monCod      = xmonCod;

  }


  getId () {
      return this.monId;
  }

  setId (xid:number) : number {
      this.monId = xid;
      return this.monId;
  }

  getmonDes () {
    return this.monDes;
}


  setmonDes (xmonDes:string) : string {
      this.monDes = xmonDes;
      return this.monDes;
  }

  getmonCod () {
    return this.monCod;
}


  setmonCod (xmonCod:string) : string {
      this.monCod = xmonCod;
      return this.monCod;
  }




}
