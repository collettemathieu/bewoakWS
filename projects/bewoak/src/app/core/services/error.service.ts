import { Injectable } from '@angular/core';
import { ToastrService } from './toastr.service';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastrService: ToastrService) { }

  public handleError(error: any): Observable<never> {
    this.toastrService.showMessage({
      type: 'danger',
      message: error.error.error.message
    });
    return throwError(error);
  }
}
