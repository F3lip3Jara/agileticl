import { Region } from "./region.model";



export class Ciudad extends Region{

  public  ciuId     :number;
  public  ciuDes    :string;
  public  ciuCod    :string;


  constructor(xid     : number,
              xciuDes : string,
              xciuCod : string,
              xidPai  : number,
              xregCod : string,
              xregDes : string,
              xidReg  : number,
              xpaiDes : string,
              xpaiCod : string
             ) {

     super(xidReg, xregDes , xregCod , xidPai , xpaiDes , xpaiCod );
     this.ciuId       = xid;
     this.ciuDes      = xciuDes;
     this.ciuCod      = xciuCod;

  }


  getciuId () {
      return this.ciuId;
  }

  setciuId (xid:number) : number {
      this.ciuId = xid;
      return this.ciuId;
  }

  getciuDes () {
    return this.ciuDes;
}


  setciuDes (xciuDes:string) : string {
      this.ciuDes = xciuDes;
      return this.ciuDes;
  }

  getciuCod () {
    return this.ciuCod;
}


  setciuCod (xciuCod:string) : string {
      this.ciuCod = xciuCod;
      return this.ciuCod;
  }




}
