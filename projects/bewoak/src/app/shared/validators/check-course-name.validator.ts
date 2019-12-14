import { Injectable } from '@angular/core';
import { CourseService } from '../../core/services/course/course.service';
import { AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckCourseNameValidator implements AsyncValidator {

  constructor(private courseService: CourseService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    return this.courseService.isAvailable(control.value).pipe(
      map(isAvailable => {
        return isAvailable ? null : { checkCourseName: true };
      }),
      catchError(() => null)
    );
  }
}
