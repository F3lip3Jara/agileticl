export class Motivo {

  public  motId     :number;
  public  motDes    :string;
  public  etaId     :number;


  constructor(xid :number , motDes: string , etaId:number ) {
     this.motId       = xid;
     this.motDes      = motDes;
     this.etaId       = etaId;
  }


  getId () {
      return this.motId;
  }

  setId (xid:number) : number {
      this.motId = xid;
      return this.motId;
  }

  getcolDes () {
    return this.motDes;
}


  setcolDes (motDes:string) : string {
      this.motDes = motDes;
      return this.motDes;
  }




}
