import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';

const routes = [
    {
        path: '', component: CatalogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CatalogRoutingModule { }