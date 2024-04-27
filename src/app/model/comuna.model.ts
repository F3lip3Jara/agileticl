import { Ciudad } from "./ciudad.model";


export class Comuna extends Ciudad{

  public  comId     :number;
  public  comDes    :string;
  public  comCod    :string;


  constructor(xid     : number,
              xcomDes : string,
              xcomCod : string,
              xidPai  : number,
              xregCod : string,
              xregDes : string,
              xidReg  : number,
              xpaiDes : string,
              xpaiCod : string,
              xciuId  : number,
              xciuDes : string,
              xciuCod : string ) {

     super(xciuId , xciuDes , xciuCod , xidPai, xregCod ,xregDes ,xidReg  , xpaiDes, xpaiCod)


     this.comId       = xid;
     this.comDes      = xcomDes;
     this.comCod      = xcomCod;

  }


  getcomId () {
      return this.comId;
  }

  setcomId (xid:number) : number {
      this.comId = xid;
      return this.comId;
  }

  getcomDes () {
    return this.comDes;
}


  setcomDes (xcomDes:string) : string {
      this.comDes = xcomDes;
      return this.comDes;
  }

  getcomCod () {
    return this.comCod;
}


  setcomCod (xcomCod:string) : string {
      this.comCod = xcomCod;
      return this.comCod;
  }




}
