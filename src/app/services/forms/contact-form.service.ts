import {Injectable, Injector} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ContactForm} from '../../interfaces-and-classes/contact_form';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';

@Injectable()
export class ContactFormService {
  protected config: AppConfig;

  constructor(private http: Http, private injector: Injector) {
    this.config = injector.get(APP_CONFIG);
  }

  submitMessage(post_data: ContactForm): Observable<Response> {
    return this.http
        .post(this.config.XHR_CONTACT_FORM, post_data);
  }

}
