export class unMed {

  public  unId     :number;
  public  unDes    :string;
  public  unCod    :string;


  constructor(xid :number , xunDes: string , xunCod : string  ) {
     this.unId       = xid;
     this.unDes      = xunDes;
     this.unCod      = xunCod;

  }


  getId () {
      return this.unId;
  }

  setId (xid:number) : number {
      this.unId = xid;
      return this.unId;
  }

  getunDes () {
    return this.unDes;
}


  setunDes (xunDes:string) : string {
      this.unDes = xunDes;
      return this.unDes;
  }

  getunCod () {
    return this.unCod;
}


  setunCod (xunCod:string) : string {
      this.unCod = xunCod;
      return this.unCod;
  }




}
