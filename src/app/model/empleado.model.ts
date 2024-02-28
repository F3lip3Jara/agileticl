export class Empleado {

  private emploNom    : string;
  private emploApe    : string;
  private emploAvatar : any;
  private empId       : number;
  private emploFecNac : string;
  private rol         : number;
  private gerId       : number;
  private empName     : string;

    constructor (emploNomx: string, emploApex: string, emploAvatarx: any, empIdx: number,  emploFecNacx : string , rolIdx : number  , idGerx:number , empNamex : string){
      this.emploNom    = emploNomx;
      this.emploApe    = emploApex;
      this.emploAvatar = emploAvatarx;
      this.empId       = empIdx;
      this.emploFecNac = emploFecNacx;
      this.rol         = rolIdx;
      this.gerId       = idGerx;
      this.empName     = empNamex;
    }

    public getrolId () : number {
       return this.rol;
    }

    public setrolId (rolIdx : number){
      this.rol = rolIdx;
    }

    public getGerId () : number {
      return this.gerId;
   }

   public setGerId (gerIdx : number){
     this.gerId = gerIdx;
   }

    public getEmploNom () :string {
      return this.emploNom;
    }

    public setEmplonom (emploNom : string) {
      this.emploNom = emploNom;
    }
    public getEmpName () :string {
      return this.empName;
    }

    public setEmpName (empNamex : string) {
      this.empName = empNamex;
    }

    public getEmploApe() :string {
      return this.emploApe;
    }

    public  setEmploApe(emploApe : string) {
      this.emploApe = emploApe;
    }

    public getEmploAvatar() :any {
      return this.emploAvatar;
    }

    public  setEmploAvatar (emploAvatar:any) {
    this.emploAvatar= emploAvatar ;
  }

    public getempId () :number{
    return this.empId;
  }

    public  setempId(empId : number) {
    this.empId = empId ;
  }

    public geEmploFecNac () : string {
    return this.emploFecNac ;
  }

    public  setEmploFecNac (emploFecNac: string) {
    this.emploFecNac = emploFecNac ;
  }


}
