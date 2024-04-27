export class Pais {

  public  paiId     :number;
  public  paiDes    :string;
  public  paiCod    :string;


  constructor(xid :number , xpaiDes: string , xpaicod : string  ) {
     this.paiId       = xid;
     this.paiDes      = xpaiDes;
     this.paiCod      = xpaicod;

  }


  getId () {
      return this.paiId;
  }

  setId (xid:number) : number {
      this.paiId = xid;
      return this.paiId;
  }

  getPaiDes () {
    return this.paiDes;
}


  setPaiDes (xpaiDes:string) : string {
      this.paiDes = xpaiDes;
      return this.paiDes;
  }

  getPaiCod () {
    return this.paiCod;
}


  setPaicod (xpaicod:string) : string {
      this.paiCod = xpaicod;
      return this.paiCod;
  }




}
