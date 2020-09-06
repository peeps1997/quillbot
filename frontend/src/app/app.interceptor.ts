import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
    errorMessages: string = '';
    constructor(private toast: ToastrManager, private loader: NgxUiLoaderService) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                    return event;
                })
            )
            .pipe(
                catchError((err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        this.loader.stop();
                        this.showToast(err.error.message);
                    }
                    return throwError(err);
                })
            );
    }
    showToast(message: string) {
        this.toast.customToastr(
            `<span style='color: #green; background:#000; font-family: monospace; font-size: 20px; text-align: center;'>${message}</span>`,
            null,
            { enableHTML: true, maxShown: 2, toastTimeout: 2000 }
        );
    }
}
