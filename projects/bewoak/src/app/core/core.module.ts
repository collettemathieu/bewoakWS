import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PublicModule } from '../public/public.module';
import { ProtectedModule } from '../protected/protected.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { AdminModule } from '../admin/admin.module';
import { MessageComponent } from './components/toastr/message/message.component';



@NgModule({
  declarations: [NavbarComponent, FooterComponent, PageNotFoundComponent, LoaderComponent, ToastrComponent, MessageComponent],
  imports: [
    SharedModule,
    HttpClientModule,
    PublicModule,
    ProtectedModule,
    AdminModule,
  ],
  exports: [NavbarComponent, FooterComponent, PageNotFoundComponent, LoaderComponent, ToastrComponent]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('The core module is already loaded.');
    }
  }
}