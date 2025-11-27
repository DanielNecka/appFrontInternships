import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainCars } from './main-cars/main-cars';
import { ViewCar } from './view-car/view-car';
import { AppRoutingModule } from "../app-routing-module";
import { AddModCar } from './add-mod-car/add-mod-car';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MainCars,
    ViewCar,
    AddModCar
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule
  ]
})
export class CarsModule { }