export class Modulo {

   optAsig  : any  = [];  
   rolAsig  : any  = [];   
   optnAsig : any  = [];  
   rolnAsig : any  = [];

   constructor() {
  
    }

    setRolAsig(rolAsig: any){
        this.rolAsig = rolAsig;
    }
    
    setRolnAsig(rolnAsig: any){
        this.rolnAsig = rolnAsig;
    }
    
    getRolnAsig(){
        return this.rolnAsig;
    }
    
    getRolAsig(){
        return this.rolnAsig;
    }

    setOptAsig(optAsig: any){
        this.optAsig = optAsig;
    }
    
    setOptnAsig(optnAsig: any){
        this.optnAsig = optnAsig;
    }
    
    getOptAsig(){
        return this.optAsig;
    }
    
    getOptnAsig(){
        return this.optnAsig;
    }


      
  }