export class Color {

  public  colId     :number;
  public  colDes    :string;
  public  colCod    :string;


  constructor(xid :number , xcolDes: string , xcolCod : string  ) {
     this.colId       = xid;
     this.colDes      = xcolDes;
     this.colCod      = xcolCod;

  }


  getId () {
      return this.colId;
  }

  setId (xid:number) : number {
      this.colId = xid;
      return this.colId;
  }

  getcolDes () {
    return this.colDes;
}


  setcolDes (xcolDes:string) : string {
      this.colDes = xcolDes;
      return this.colDes;
  }

  getcolCod () {
    return this.colCod;
}


  setcolCod (xcolCod:string) : string {
      this.colCod = xcolCod;
      return this.colCod;
  }




}
