import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.scss']
})
export class DireccionComponent {

  @ViewChild('cenDir') cenDir!: ElementRef;
  @Output() onItemAdded: EventEmitter<any>;
  @Input() cenDes? : string;

  constructor(private renderer : Renderer2){
    this.onItemAdded = new EventEmitter();
  }

  ngOnInit(): void {
    this.loadGoogleMaps();
  }


   // Carga el script de Google Maps
   public loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key==places`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initAutocomplete();
    document.body.appendChild(script);
    
  }

    // Inicializa el autocompletado de direcciones
    initAutocomplete() {
      const address1Field = this.cenDir.nativeElement;
    
    
      if (address1Field) {
        const autocomplete = new google.maps.places.Autocomplete(address1Field, {
          fields: ['address_components', 'geometry', 'name'],
          types: ['address'],
          componentRestrictions: { country: 'CL' }
        });
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert(`No details available for input: '${place.name}'`);
            return;
          }else{
            let places  = {place: place , cenDir: this.cenDir.nativeElement.value}
            this.onItemAdded.emit(places);
          }
  
          
        });
  
        this.renderer.listen(address1Field, 'change', (event) => {
          
        });
      } else {
        console.log('El campo cenDir no está disponible.');
      }
    }
  
}
