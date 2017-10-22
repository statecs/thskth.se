import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { APP_CONFIG } from '../../app.config';
import {AppConfig} from '../../interfaces/appConfig';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import {ContactFormService} from '../../services/forms/contact-form.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  protected config: AppConfig;
  public subjects: object[];
  private full_name: string;
  private email: string;
  private message: string;
  private id_number: string;
  public error: string;
  public success: string;
  public lang: string;

  constructor(private injector: Injector,
              public contactFormService: ContactFormService,
              private activatedRoute: ActivatedRoute) {
    this.config = injector.get(APP_CONFIG);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
    this.subjects = [
      {
        name: '---', email: ''
      }, {
        name: 'karx@ths.kth.se', email: 'Membership'
      }, {
        name: 'studiesocialt@ths.kth.se', email: 'Social activities'
      }, {
        name: 'utbildning@ths.kth.se', email: 'Education'
      }, {
        name: 'naringsliv@ths.kth.se', email: 'Business relations'
      }, {
        name: 'studiesocialt@ths.kth.se', email: 'Study environment'
      }, {
        name: 'kommunikation@ths.kth.se', email: 'Information'
      }, {
        name: 'karx@ths.kth.se', email: 'Student ID card'
      }, {
        name: 'lokalbokning@ths.kth.se', email: 'Booking inquiries'
      }, {
        name: 'event@ths.kth.se', email: 'Party related'
      }, {
        name: 'restaurang@ths.kth.se', email: 'Nymble restaurants'
      }, {
        name: 'roger2@kth.se', email: 'Report a fault in Nymble'
      }, {
        name: 'naringsliv@ths.kth.se', email: 'Advertising'
      }, {
        name: 'webmaster@ths.kth.se', email: 'Webmaster'
      }, {
        name: 'kommunikation@ths.kth.se', email: 'Övrigt/Other'
      },
    ];
    this.full_name = '';
    this.email = '';
    this.message = '';
    this.id_number = null;
    this.error = null;
    this.success = null;
  }

  submitMessage(): void {
    this.error = null;
    this.success = null;
    console.log(this.full_name);
    console.log(this.email);
    console.log(this.message);
    if (this.full_name === '' || this.email === '' || this.message === '' ) {
      if (this.lang === 'en') {
        this.error = 'Please fill in the required fields (*)!';
      }else {
        this.error = 'Vänligen fyll i obligatoriska fält (*)!';
      }
    }else if (this.captcha.getResponse() === '') {
      if (this.lang === 'en') {
        this.error = 'Please resolve the reCAPTCHA and submit!';
      }else {
        this.error = 'Vänligen lösa reCAPTCHA och skicka in!';
      }
    }else {
      const post_data = {  // prepare payload for request
        'name': this.full_name,
        'email': this.email,
        'message': this.message,
        'pnumber': this.id_number,
        'g-recaptcha-response': this.captcha.getResponse()  // send g-captcah-reponse to our server
      };
      this.contactFormService.submitMessage(post_data).subscribe(
          (res) => {
            console.log(res);
            if (this.lang === 'en') {
              this.success = 'Email sent! We will get back to you shortly!';
            }else {
              this.success = 'Mail skickat! Vi kommer att kontakta dig inom kort.';
            }
          },
          (err) => {
            if (this.lang === 'en') {
              this.error = 'There was an error. Email not sent!';
            }else {
              this.error = 'Det uppstod ett problem. Mail inte skickat!';
            }
            console.log(err);
          }
      );
      console.log(post_data);
    }


    console.log(this.captcha.getResponse());
  }

  ngOnInit() {
  }

}
