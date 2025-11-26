import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainCars } from './main-cars/main-cars';
import { ViewCar } from './view-car/view-car';
import { AppRoutingModule } from "../app-routing-module";
import { AddModCar } from './add-mod-car/add-mod-car';

@NgModule({
  declarations: [
    MainCars,
    ViewCar,
    AddModCar
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class CarsModule { }