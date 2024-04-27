import { Pais } from "./pais.model";

export class Region extends Pais{

  public  regId     :number;
  public  regDes    :string;
  public  regCod    :string;


  constructor(xid :number , xregDes: string , xregCod : string  , xidPai :number , xpaiDes: string , xpaicod : string) {
     super(xidPai , xpaiDes, xpaicod);
     this.regId       = xid;
     this.regDes      = xregDes;
     this.regCod      = xregCod;

  }


  getregId () {
      return this.regId;
  }

  setregId (xid:number) : number {
      this.regId = xid;
      return this.regId;
  }

  getregDes () {
    return this.regDes;
}


  setregDes (xregDes:string) : string {
      this.regDes = xregDes;
      return this.regDes;
  }

  getregCod () {
    return this.regCod;
}


  setregCod (xregCod:string) : string {
      this.regCod = xregCod;
      return this.regCod;
  }




}
