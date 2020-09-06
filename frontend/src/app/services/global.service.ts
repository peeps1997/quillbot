import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConfig } from '../constants/config';

@Injectable()
export class GlobalService {

  backendConfig = new BackendConfig();
  baseUrl: any = this.backendConfig.API_BASE_ENDPOINT;
  constructor(public http: HttpClient) { }

  public httpGet(requestString: string): Observable<HttpResponse<any>> {
    return this.http.get(this.baseUrl + requestString, {
      observe: 'response'
    });
  }
  
  public httpPost(requestString: string, data: any): Observable<HttpResponse<any>> {
    return this.http.post(this.baseUrl + requestString, data, {
      observe: 'response'
    });
  }

}
