import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Alert } from 'src/app/model/alert.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert', 
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(private messageService: MessageService, private servicio: AlertasService) {}

  ngOnInit(): void {
    this.subscription = this.servicio.disparador.subscribe({
      next: (alert: Alert) => {
        let summary = '';
        switch (alert.type) {
          case 'success':
            summary = 'Correcto';
            this.playAudio('assets/notificacion.mp3');
            break;
          case 'danger':
            summary = 'Error';
            this.playAudio('assets/error.mp3');
            break;
          case 'warning':
            summary = 'Precaución';
            break;    
        }
        this.messageService.add({ severity: alert.type, summary: summary, detail: alert.message, key: 'br', life: 3000 });
      },
      error: (err: any) => {
        console.error('Error handling alert:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private playAudio(audioUrl: string): void {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
