import { Etapas } from 'src/app/model/etapas.model';

export class Maquinas extends Etapas {

  public maqId: number;
  public maqDes: string;
  public maqCod: string;
  public maqTip: string;


 constructor( id :number , etaDes : string , etaProd : string , maqId: number , maqDes:string , maqCod : string, maqTip : string ){
    super(id, etaDes , etaProd);
    this.maqId = maqId;
    this.maqDes = maqDes;
    this.maqCod = maqCod;
    this.maqTip = maqTip;
 }

 setMaqDes(maqDes : string ){
    this.maqDes = maqDes;
 }

 getMaqDes():string{
      return this.maqDes;
 }

 getmaqId():number{
  return this.maqId;
  }

  setmaqId(maqId : number){
   this.maqId = maqId;
  }


  setMaqCod(maqCod : string ){
    this.maqCod = maqCod;
  }

 getMaqCod():string{
      return this.maqCod;
  }

  setMaqTip(maqTip : string ){
    this.maqTip = maqTip;
  }

 getMaqTip():string{
      return this.maqTip;
  }
}
