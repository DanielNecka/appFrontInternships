import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    Header,
    Footer
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    Header,
    Footer
  ]
})
export class SharedModule { }
