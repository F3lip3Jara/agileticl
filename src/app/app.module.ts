import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
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

  
} from '@coreui/angular';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';



const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS,
  LoginComponent,
  AlertComponent,
  ProgresoComponent,
  ScrollToTopButtonComponent,
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
    NgbTypeaheadModule
  ],
  providers: [
    CookieService,    
    { provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsErrorService,
      multi: true
     },
     
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
