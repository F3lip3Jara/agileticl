import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/servicios/users.service';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { RestService } from 'src/app/servicios/rest.service';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from 'src/app/servicios/excel.service';
import { LogSysService } from 'src/app/servicios/log-sys.service';
import { LogSys } from 'src/app/model/logSys.model';
import { LoadingService } from 'src/app/servicios/loading.service';
import { faFileExcel, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-up-des-proveeedor',
  templateUrl: './up-des-proveeedor.component.html',
  styleUrls: ['./up-des-proveeedor.component.css']
})
export class UpDesProveeedorComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  proveedor        : any;
  tblProveedor     : any;
  token            : any;
  parametros       : any []              = [];
  loading         : boolean              = true;
  dtOptions       : DataTables.Settings  = {} ;
  carga           : string               = "invisible";
  faFileExcel                            = faFileExcel;
  faTrash                                =faTrash;

  constructor(private serProveedor : ProveedoresService,
    private rest         : RestService,
    private servicio     : UsersService,
    private excel        : ExcelService,
    private serLog       : LogSysService,
    private serviLoad    : LoadingService
    ) {

       this.proveedor = this.serProveedor.getProveedor();
       this.token     = this.servicio.getToken();
    }

  ngOnInit(): void {

    this.tblData();
  }

  public tblData(){
    this.tblProveedor = {};
    this.rest.get('trabPrvDir' , this.token, this.parametros).subscribe(data => {
      this.tblProveedor = data;
      console.log(data);
      
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },500 );
   
     this.serviLoad.sumar.emit(1);
    }
  

   public Excel(){
    this.excel.exportAsExcelFile(this.tblProveedor, 'proveedores');
    return false;
   }


   public delPrvDir( proveedor : any){
    let url      = 'delPrvDir';
    this.carga   = 'invisible';
    this.loading = true;

     this.rest.post(url ,this.token, proveedor ).subscribe(resp => {
         resp.forEach((elementx : any)  => {
           if(elementx.error == '0'){
            let   des              = 'Eliminar de dirección proveedor id: '+ proveedor.id;
            let   log  : LogSys    = new LogSys(2, '' , 24, 'ELIMINAR DIR PROVEEDOR/CLIENTE'  , des);
            this.serLog.insLog(log);
             
             setTimeout(()=>{              
               this.tblProveedor = {};
               this.rest.get('trabPrvDir' , this.token, this.parametros).subscribe(data => {
                   this.tblProveedor = data;
               });
               this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
                 dtInstance.destroy().draw();
               });

               this.carga    = 'visible';
               this.loading  = false;
             },1500);

           }else{
             this.carga    = 'visible';
             this.loading  = false;  
             }
         });
     });
     return false;
   }
}
