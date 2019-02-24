import {Injectable} from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {HttpResponses} from '../../utils/contants';

@Injectable()
export class DataFetcherService {

    constructor(private http: Http) {
    }

    get(url: string, params: URLSearchParams = null): Observable<any> {
        return this.http.get(url, {params})
            .map(data => this.extractData(data))
            .share()
            .catch(this.handleError);
    }

    post(url: string, data: any): Observable<any> {
        return this.http.post(url, JSON.stringify(data), { headers: new Headers({ 'Content-Type': 'application/json' }) })
            .map(response => response == null || response.status === 204 ? null : this.extractData(response))
            .share()
            .catch(this.handleError);
    }

    put(url: string, data: any): Observable<any> {
        return this.http.put(url, JSON.stringify(data), { headers: new Headers({ 'Content-Type': 'application/json' }) })
            .map(response => response == null || response.status === 204 ? null : this.extractData(response))
            .share()
            .catch(this.handleError);
    }

    extractData(data: Response): any {
        return data.json();
    }

    handleError(error: any): any {
        if (error.status) {
            switch (error.status) {
                case 400: return Observable.throw(HttpResponses.RESPONSE_400);
                case 401: return Observable.throw(HttpResponses.RESPONSE_401);
                case 404: return Observable.throw(HttpResponses.RESPONSE_404);
                case 500: return Observable.throw(HttpResponses.RESPONSE_500);
                case 501: return Observable.throw(HttpResponses.RESPONSE_501);
            }
        }
        return Observable.throw(error.message);
    }
}
