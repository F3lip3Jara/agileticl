export class Roles {

  public  rolId    :number;
  public  rolDes    :string;


  constructor(xid :number , xprdDes: string  ) {
      this.rolId       = xid;
      this.rolDes   = xprdDes;

  }

  getRolDes () {
      return this.rolDes;
  }

  getId () {
      return this.rolId;
  }

  setId (xid:number) : number {
      this.rolId = xid;
      return this.rolId;
  }

  setRolDes (xrolDes:string) : string {
      this.rolDes = xrolDes;
      return this.rolDes;
  }



}
