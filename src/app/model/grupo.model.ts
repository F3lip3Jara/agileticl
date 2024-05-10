export class Grupo {

  public  grpId     :number;
  public  grpDes    :string;
  public  grpCod    :string;


  constructor(xid :number , xgrpDes: string , xgrpCod : string  ) {
     this.grpId       = xid;
     this.grpDes      = xgrpDes;
     this.grpCod      = xgrpCod;

  }


  getId () {
      return this.grpId;
  }

  setId (xid:number) : number {
      this.grpId = xid;
      return this.grpId;
  }

  getgrpDes () {
    return this.grpDes;
}


  setgrpDes (xgrpDes:string) : string {
      this.grpDes = xgrpDes;
      return this.grpDes;
  }

  getgrpCod () {
    return this.grpCod;
}


  setgrpCod (xgrpCod:string) : string {
      this.grpCod = xgrpCod;
      return this.grpCod;
  }




}
