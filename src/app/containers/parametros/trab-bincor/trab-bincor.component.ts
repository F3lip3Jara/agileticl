import { LoadingService } from './../../../servicios/loading.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { RestService } from 'src/app/servicios/rest.service';
import { UsersService } from 'src/app/servicios/users.service';
import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faFileExcel , faAddressCard, faPenToSquare, faTrash , faPlusCircle , faEye} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trab-bincor',
  templateUrl: './trab-bincor.component.html',
  styleUrls: ['./trab-bincor.component.css']
})
export class TrabBincorComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;


  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblBins      : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  bins         : any;
  binsDet      : any;
  upBins       : FormGroup;
  val          : boolean              = false;
  faPenToSquare                       = faPenToSquare;  
  faTrash                             = faTrash;
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPlusCircle                        = faPlusCircle;
  faEye                               = faEye;


  constructor( private servicio     : UsersService,
              private rest          : RestService,
              private excel         : ExcelService,
              private servicioaler  : AlertasService,
              private serviLoad     : LoadingService,
              private fb           : FormBuilder,
              private modal        : NgbModal,
              
    ) {
            this.token = this.servicio.getToken();
            this.upBins = fb.group({
              colbnum : ['',  Validators.compose([
               Validators.required,
               Validators.pattern('^-?[0-9]\\d*?$')])]
           });

    }

  ngOnInit(): void {
    this.tblData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu : [20,50,100, 200],
      processing: true,
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        }
      }}
      this.serviLoad.sumar.emit(1);
  }

  public tblData(){
   
    this.tblBins = {};
    this.rest.get('trabBins' , this.token, this.parametros).subscribe(data => {
        this.tblBins = data;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

   public modelUp(model:any , bins: any){
    this.modal.open(model);
    this.bins = bins;
   }  

   public action(bins:any , colbnumnew:any){
    this.serviLoad.sumar.emit(1);
    this.parametros = [{'bins' : bins ,  'colbnumnew' : colbnumnew }];
    this.rest.post('upBins' , this.token, this.parametros).subscribe(data => {
      data.forEach((elementx : any)  => {
        if(elementx.error == '0'){       
          this.modal.dismissAll();
          setTimeout(()=>{
           this.tblBins = {};
            this.rest.get('trabBins' , this.token, this.parametros).subscribe(data => {
                this.tblBins = data;
            });
            this.datatableElement?.dtInstance.then((dtInstance : DataTables.Api) => {
             dtInstance.destroy().draw();
           });
            this.carga    = 'visible';
            this.loading  = false;
            this.servicioaler.disparador.emit( this.servicioaler.getAlert());
          },1500);
          
        }else{
          this.carga    = 'visible';
          this.loading  = false;
        }
       });
       
      });
  }

  public ver(content : any, bins:any){
    this.modal.open(content);
    this.bins       = bins;
    this.parametros = [{key : 'idColb' , value:bins.idColb }];
    this.binsDet    = {};
    this.rest.get('verBins' , this.token, this.parametros).subscribe(data => {
       this.binsDet = data;
    });
  }


}
