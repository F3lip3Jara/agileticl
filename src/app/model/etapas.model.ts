export class Etapas {

  public etaId: number;
  public etaDes: string;
  public etaProd: string;

 constructor(  id : number ,  etaDes : string , etaProd: string ){

   this.etaId = id;
   this.etaDes = etaDes;
   this.etaProd = etaProd;

 }

 setEtaDes(etaDes : string ){
    this.etaDes = etaDes;
 }

 getEtaDes():string{
      return this.etaDes;
 }

 setEtProd(etaProd : string ){
  this.etaProd = etaProd;
}

getEtaProd():string{
    return this.etaProd;
}

 getetaId():number{
  return this.etaId;
  }

  setetaId(etaId : number){
   this.etaId = etaId;
  }
}
