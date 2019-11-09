import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { SearchBarComponent } from './search-bar/search-bar.component';



@NgModule({
  declarations: [HomeComponent, SearchBarComponent],
  imports: [
    SharedModule
  ]
})
export class HomeModule { }
