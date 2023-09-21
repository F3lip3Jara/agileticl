import { Component, HostListener, OnInit } from '@angular/core';
import { faChevronUp} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scroll-to-top-button',
  templateUrl: './scroll-to-top-button.component.html',
  styleUrls: ['./scroll-to-top-button.component.css']
})
export class ScrollToTopButtonComponent implements OnInit {
  showScrollToTopButton = false;
  faChevronUp           = faChevronUp;

  @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: Event) {
     
      const scrollTop = window.scrollY;
      const scrollTriggerPosition = 400; // La posición específica en la que desea mostrar el botón
      if (scrollTop > scrollTriggerPosition) {
        this.showScrollToTopButton = true;
      } else {
        this.showScrollToTopButton = false;
      }
      
    }

    

  constructor() { 

    
  }

  ngOnInit(): void {

  
  }

  scrollToTop() {
    console.log("adas");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
