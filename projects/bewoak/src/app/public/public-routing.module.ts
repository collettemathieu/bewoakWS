import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';


const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then( m => m.CatalogModule)
  },
  {
    path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
