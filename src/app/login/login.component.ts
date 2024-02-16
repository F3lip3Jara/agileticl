import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsersService} from '../servicios/users.service';
import {AlertasService} from '../servicios/alertas.service';
import {LogSysService} from '../servicios/log-sys.service';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario.model';
import { LogSys } from './../model/logSys.model';

import { faLock , faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  login: FormGroup;
  log: boolean = false;
  faLock = faLock;
  faUser = faUser;
  
  constructor(fb          : FormBuilder,
    private UsersService  : UsersService,
    private router        : Router,
    private servicioAler  : AlertasService,
    private serLog        : LogSysService,
) {

    this.login = fb.group({
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.UsersService.setToken("");

  }

  ngOnInit(): void {

  }
  
  guardar(email: string, password: string): boolean {
    this.log    = true;
    const userx = new Usuario(1, '', password, '', email);
    this.UsersService.eliminarToken();

    this.UsersService.login(userx).subscribe(data => {
      if(!data.id) {
        this.servicioAler.disparador.emit(this.servicioAler.getAlert());
        this.log = false;        
      }else{

        let reinicio: string = data.reinicio;
        let token   : string = data.token;
        let crf     : string = data.crf;
        let menu    : string = data.menu;
        let rol     : string = data.rol;
        let usuario : string = data.name;
        let img     : string = data.img;
        let empresa : string = data.empresa;

        this.UsersService.setToken(token);
        this.UsersService.setTokenCrf(crf);
        this.UsersService.setUsuario(usuario , rol , menu, img, empresa);

        if (reinicio == 'S') {
          this.router.navigate(['/changePassword']);
        } else {
          this.router.navigate(['/home']);
          this.log = false;
        }
      }
    });
      return false;
  }




}
