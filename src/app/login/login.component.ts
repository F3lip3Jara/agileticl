import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsersService} from '../servicios/users.service';
import {AlertasService} from '../servicios/alertas.service';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario.model';
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
  
  guardar(email: string, password: string): void {
    const user = new Usuario(1, '', password, '', email);
    this.UsersService.eliminarToken();
    this.log = true;
    this.UsersService.login(user).subscribe({
      next: (data) => {
        if (!data.id) {
          this.servicioAler.disparador.emit(this.servicioAler.getAlert());
        } else {
          const { reinicio, token, crf, menu, rol, name, img, empresa, imgEmp } = data;  
          this.UsersService.setToken(token);
          this.UsersService.setTokenCrf(crf);
          this.UsersService.setUsuario(name, rol, menu, img, empresa, imgEmp);  
          if (reinicio === 'S') {
            this.router.navigate(['cambiopass']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      error: (err) => {
        // Manejar el error, si es necesario
      }
    });
  }



}
