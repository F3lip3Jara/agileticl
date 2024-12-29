import { Component, ViewChild } from '@angular/core';
import { faAddressCard, faBuildingCircleArrowRight, faClipboardList, faEye, faFileExcel, faFilePdf, faPenToSquare, faSquarePlus, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExcelService } from 'src/app/servicios/excel.service';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from 'src/app/servicios/users.service';
import { RestService } from 'src/app/servicios/rest.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-trab-ordenes-wms',
  templateUrl: './trab-ordenes-wms.component.html',
  styleUrls: ['./trab-ordenes-wms.component.scss']
})
export class TrabOrdenesWmsComponent {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  loading      : boolean              = true;
  dtOptions    : DataTables.Settings  = {} ;
  tblObj       : any                  = {};
  token        : string               = '';
  parametros   : any []               = [];
  carga        : string               = "invisible";
  faFileExcel                         = faFileExcel;
  faAddressCard                       = faAddressCard;
  faPenToSquare                       = faPenToSquare;
  faSquarePlus                        = faSquarePlus;
  faTrash                             = faTrash;
  accion      : string                = '';
  tipo        : any                   = {};
  cenDir      : string                = '';
  places      : any                   = {};
  dt          :any                    = {};
  faBuildingCircleArrowRight          = faBuildingCircleArrowRight;
  faEye                               = faEye;
  prd         :any                    = {};
  faSyncAlt                           = faSyncAlt;
  colums     :string []               = [];
  isQuantityValid: boolean            = false;
  faClipboardList                     = faClipboardList;
  sectorFil : any                     = {};
  val       : boolean                 = false;
  disable   : boolean                 = false;
  faFilePdf                           = faFilePdf;
  

  constructor(
              private servicio     : UsersService,
              private rest         : RestService,
              private excel        : ExcelService,             
              private serviLoad    : LoadingService,
              private router       : Router,
              private modal        : NgbModal
             
    ) {
            this.token = this.servicio.getToken();
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
  }

  public tblData(){
    this.serviLoad.sumar.emit(1);
    this.tblObj = {};
    this.rest.get('trabSdOrden' , this.token, this.parametros).subscribe((data : any) => {
        this.tblObj = data.data;
        this.colums = data.colums;
    });
    setTimeout(()=> {
        this.carga = 'visible';
        this.loading = false;
     },1500 );
   }

  public Excel(){
    this.excel.exportAsExcelFile(this.tblObj, 'ordenes_wms');
     return false;
  }

  public ver(data:any , content:any){
    this.dt = data;    
    this.parametros = [{key:'ordId' , value:this.dt.ordId}];
    this.rest.get('verSdOrden' , this.token, this.parametros).subscribe((data:any) => {
        this.prd = data;
    });
    this.modal.open(content);
  }
  public verificarEE(data:any , content : any ){
    this.dt = data;    
    this.parametros = [{key:'centroId' , value:this.dt.centroId} , {key:'almId' , value:this.dt.almId}];
    this.rest.get('sectorFil' , this.token, this.parametros).subscribe((data:any) => {
        this.sectorFil = data;
    });

    this.parametros = [{key:'ordId' , value:this.dt.ordId}];
    this.rest.get('verSdOrden' , this.token, this.parametros).subscribe((data:any) => {
        this.prd = data;
    });

    this.modal.open(content , { size: 'xl' });
    console.log(data);
  }

  validateQuantities() {
    // Comprueba si al menos un producto tiene cantidad mayor a 0
     this.isQuantityValid = this.prd.some((item: any) => item.enteredQty && item.enteredQty > 0);
  }


  refrescar(){
    this.parametros =[];
    this.tblData();
  }
  public addFilter(parametros: any){
    this.parametros = parametros;
    this.tblData();
  }
  
  generarIBLPN(orden:any , prd:any){
    this.disable = true;
    this.val     = true;
    this.parametros = [{'prd':prd , 'centroId':orden.centroId , 'almId':orden.almId }];
    this.rest.post('insOrdTrasInt' , this.token, this.parametros).subscribe(data => {
      this.val = false;
      this.disable = false;
      this.modal.dismissAll();
    });

  }
  
  generarPDFTraslado(data:any){
    this.dt = data;    
    this.parametros = [{key:'ordId' , value:this.dt.ordId}];

    this.rest.get('pdfOrden' , this.token, this.parametros).subscribe((data:any) => {
        this.prd = data;       
        console.log(data);
        
        const canvas = document.createElement('canvas');
        
        JsBarcode(canvas, this.dt.ordNumber, {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: true,
        });

        // Convertir el código de barras a imagen base64
        const barcodeImage = canvas.toDataURL('image/png');

        // Crear una nueva instancia de jsPDF
        const doc = new jsPDF();
        
        // Agregar título al PDF
        doc.text('Orden de Traslado interno WMS', 10, 10);
    
        // Agregar información adicional
        doc.text('Fecha: ' + new Date().toLocaleDateString(), 10, 20);
        doc.text('Centro:' + this.dt.cenDes , 10, 30);
        doc.text('Proveedor: ' + this.dt.ordHdrCustShortText7 , 10, 40);
        doc.text('N° Orden:' + this.dt.ordNumber , 10, 50);
        doc.addImage(barcodeImage, 'PNG', 80, 50, 80, 20);
    
        // Configuración para las filas
        const tableRows: any[] = [];
        const startY = 80; // Posición inicial de la tabla

        // Encabezados de la tabla
        const headers = ["Producto", "Qty Sol", "Cantidad", "Sector Destino", "Iblpn", "IblCode"];

        
        this.prd.forEach((element: any) => {
             // Generar código de barras para cada fila
            JsBarcode(canvas, element.iblpnOriginalBarcode, {
              format: 'CODE128',
              width: 2,
              height: 30,
              displayValue: false,
            });

            // Convertir el código de barras a imagen base64
            const barcodeImageRow = canvas.toDataURL('image/png');

            // Agregar datos a la tabla
            tableRows.push({
              producto: element.prdCod,
              cantidadSolicitada: element.iblpnHdrCustShortText6,
              cantidad: element.iblpnQty,
              sectorDestino: element.trasSecDesDes,
              iblpn : element.iblpnOriginalBarcode,
              barcode: barcodeImageRow, // Guardamos la imagen base64 aquí
            });
        }); //producto 

        autoTable(doc, {
          head: [headers],
          body: tableRows.map(row => [
            row.producto,
            row.cantidadSolicitada,
            row.cantidad,
            row.sectorDestino,
            row.iblpn,
            {
              content: '', // Celda vacía donde irá el código de barras
              styles: { cellWidth: 50, minCellHeight: 30 }, // Aumenta el alto de la celda
            },
          ]),
          styles: {
            halign: 'center', // Alineación horizontal: center, left, right
            valign: 'middle', // Alineación vertical: top, middle, bottom
            fillColor: [255, 255, 255], // Fondo blanco
            textColor: [0, 0, 0],       // Texto negro
            lineColor: [0, 0, 0],       // Líneas negras
            lineWidth: 0.1,             // Grosor de las líneas
          },
          headStyles: {
            fillColor: [255, 255, 255],       // Fondo negro para el encabezado
            textColor: [0,0, 0], // Texto blanco para el encabezado
          },
          startY: startY, // Asegúrate de que esta posición esté después del encabezado
          didDrawCell: (data: any) => {
            if (data.column.index === 5 && data.row.index !== -1) {
              // Inserta el código de barras únicamente en las celdas correspondientes
              const barcodeRow = tableRows[data.row.index]?.barcode;
              if (barcodeRow) {
                const xPos = data.cell.x + 3; // Ajusta la posición X
                const yPos = data.cell.y + 7.5; // Ajusta la posición Y para no pisar el encabezado
                doc.addImage(barcodeRow, 'PNG', xPos, yPos, 45, 15);
              }
            }
          },
        });
      
        // Guardar el archivo PDF
        doc.save('orden-wms_' + this.dt.ordNumber + '.pdf');
      });
  }
}