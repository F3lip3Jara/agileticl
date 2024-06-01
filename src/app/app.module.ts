import { LOCALE_ID, NgModule } from '@angular/core';
import { DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { InterceptorsErrorService } from './interceptors/interceptors-error.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { LoginComponent } from './login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from './containers/alert/alert.component';
import { ProgresoComponent } from './containers/progreso/progreso.component';
import { ScrollToTopButtonComponent } from './containers/scroll-to-top-button/scroll-to-top-button.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideUserIdleConfig } from 'angular-user-idle';
import {ModalEsperaComponent} from './containers/modal-espera/modal-espera.component'
//import { TrabUserComponent } from './containers/seguridad/trab-user/trab-user.component';  

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';



import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  ToastModule,
  UtilitiesModule,
  InputGroupComponent,
  FormCheckComponent

  
} from '@coreui/angular';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CambiopassComponent } from './containers/seguridad/cambiopass/cambiopass.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import localeDe from '@angular/common/locales/es';
import localeDeExtra from '@angular/common/locales/extra/es';


registerLocaleData(localeDe, 'es', localeDeExtra);


const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

import { ButtonModule  as ButtonModuleP } from 'primeng/button';
import { BrowserModule  as  BrowserModuleP} from '@angular/platform-browser';
import { BrowserAnimationsModule as BrowserAnimationsModuleP} from '@angular/platform-browser/animations';
import { ToastModule as ToastModuleP } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS,
  LoginComponent,
  AlertComponent,
  ProgresoComponent,
  ScrollToTopButtonComponent,
  ModalEsperaComponent,
  CambiopassComponent
  //TrabUserComponent

],
  imports: [
  
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    UtilitiesModule,
    ButtonGroupModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    HttpClientModule,
    DataTablesModule,
    FontAwesomeModule,
    ToastModule,
    NgbModule,
    NgbTypeaheadModule,
    NgSelectModule,
    ImageCropperModule,
    InputGroupComponent,
    FormCheckComponent,
    ToastModuleP,
    ButtonModuleP,
    
  
  
    
  ],
  providers: [
    CookieService,
    DatePipe,
    MessageService,
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsErrorService,
      multi: true
     },
     
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    provideUserIdleConfig({ idle: 300, timeout: 60, ping: 120 }),

    IconSetService,
    Title
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
}
