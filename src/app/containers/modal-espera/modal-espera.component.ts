import { Component, ElementRef, OnInit, ViewChild, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserIdleService } from 'angular-user-idle';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { UsersService } from 'src/app/servicios/users.service';


@Component({
  selector: 'app-modal-espera',
  templateUrl: './modal-espera.component.html',
  styleUrls: ['./modal-espera.component.css']
})
export class ModalEsperaComponent implements OnInit {
  @ViewChild('miModal', { static: true  }) miModal: ElementRef | undefined;
  modalActive                                    : boolean = false;
  timeLeft = 60;
  interval : any ;

  constructor(private userIdle      : UserIdleService,
              private modalService  : NgbModal,
              private router        : Router,
              private servicioAler  : AlertasService,
              private servicioUser  : UsersService
              ) {
  }

  ngOnInit(): void {

    this.userIdle.startWatching();

    //idle en app.module indica el tiempo de inactividad que espera el aplicativo 
    
    this.userIdle.onTimerStart().subscribe(count => {
      //console.log(count);
    });
    this.userIdle.onTimerStart().subscribe(() => {
      // Cuando comienza el temporizador, verificamos si el modal está activo
      // y, si no lo está, lo abrimos.
      if (!this.modalActive) {
        
        this.modalActive = true;
        const audio = new Audio('assets/water-droplet-bubble-pop.mp3');
        audio.play();
        
        this.interval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          }
        },1000)
        const modalRef = this.modalService.open(this.miModal , { backdrop: 'static', keyboard: false , size:'sm' });
         modalRef.result.then((result) => {                  
          // El usuario ha confirmado que está presente, reiniciar el temporizador de inactividad
          this.userIdle.resetTimer();
          this.modalActive = false
          this.modalService.dismissAll();
          this.timeLeft    = 60;
          clearInterval(this.interval);
        });
      }
    });    

   
    this.userIdle.onTimeout().subscribe(() => {
      // Cuando el temporizador expira, cerramos el modal y redirigimos al usuario a la página de inicio de sesión.
      if (this.modalActive) {          
        this.servicioUser.eliminarToken();
        this.servicioAler.setAlert('','');
        this.modalService.dismissAll();
        this.userIdle.resetTimer();
       // this.router.navigate(['/']);
       window.location.href = '/';
      }
    });
  }

}
