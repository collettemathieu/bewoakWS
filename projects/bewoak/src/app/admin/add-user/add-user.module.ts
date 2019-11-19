import { NgModule } from '@angular/core';

import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPasswordService } from '../../core/services/user/user-password.service';


@NgModule({
  declarations: [AddUserComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AddUserRoutingModule
  ],
  providers: [UserPasswordService]
})
export class AddUserModule { }
