export class Motivo {

  public  idMot     :number;
  public  motDes    :string;
  public  idEta     :number;


  constructor(xid :number , motDes: string , idEta:number ) {
     this.idMot       = xid;
     this.motDes      = motDes;
     this.idEta       = idEta;
  }


  getId () {
      return this.idMot;
  }

  setId (xid:number) : number {
      this.idMot = xid;
      return this.idMot;
  }

  getcolDes () {
    return this.motDes;
}


  setcolDes (motDes:string) : string {
      this.motDes = motDes;
      return this.motDes;
  }




}
