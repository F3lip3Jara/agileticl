import { Grupo } from './grupo.model';


export class SubGrupo extends Grupo{

  public  grpsId   :number;
  public  grpsDes    :string;
  public  grpsCod    :string;


  constructor(xid :number , xgrpsDes: string , xgrpsCod : string  , xidGrp :number , xgrpDes: string , xgrpCod : string) {
     super(xidGrp , xgrpDes, xgrpCod);
     this.grpsId       = xid;
     this.grpsDes      = xgrpsDes;
     this.grpsCod      = xgrpsCod;

  }


  getgrpsId () {
      return this.grpsId;
  }

  setgrpsId (xid:number) : number {
      this.grpsId = xid;
      return this.grpsId;
  }

  getgrpsDes () {
    return this.grpsDes;
}


  setgrpsDes (xgrpsDes:string) : string {
      this.grpsDes = xgrpsDes;
      return this.grpsDes;
  }

  getgrpsCod () {
    return this.grpsCod;
}


  setgrpsCod (xgrpsCod:string) : string {
      this.grpsCod = xgrpsCod;
      return this.grpsCod;
  }




}
