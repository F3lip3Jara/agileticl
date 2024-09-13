import { Injectable} from '@angular/core';

import { INavData } from '@coreui/angular';

@Injectable({
  providedIn: 'root'
})


export class NavService {


    navItems: INavData[] = [];
    menu    : any        = [];

  constructor(){
    console.log(this.menu);
    
        
  }



}
