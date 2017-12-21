import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { APP_CONFIG } from '../../app.config';
import {AppConfig} from '../../interfaces/appConfig';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import {ContactFormService} from '../../services/forms/contact-form.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  public config: AppConfig;
  public subjects: object[];
  public error: string;
  public success: string;
  public lang: string;
  public paramsSubscription: Subscription;
  public submitSubscription: Subscription;
  public contactForm: FormGroup;

  constructor(private injector: Injector,
              public contactFormService: ContactFormService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.config = injector.get(APP_CONFIG);
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
    this.contactForm = fb.group({
      subject_to: ['', Validators.required],
      message: ['', Validators.required],
      full_name: ['', Validators.required],
      id_number: [null],
      email: ['', [Validators.required, Validators.email]],
    });
    this.subjects = [
      {
        email: '', name: '---'
      }, {
        email: 'karx@ths.kth.se', name: 'Membership'
      }, {
        email: 'studiesocialt@ths.kth.se', name: 'Social activities'
      }, {
        email: 'utbildning@ths.kth.se', name: 'Education'
      }, {
        email: 'naringsliv@ths.kth.se', name: 'Business relations'
      }, {
        email: 'studiesocialt@ths.kth.se', name: 'Study environment'
      }, {
        email: 'kommunikation@ths.kth.se', name: 'Information'
      }, {
        email: 'karx@ths.kth.se', name: 'Student ID card'
      }, {
        email: 'lokalbokning@ths.kth.se', name: 'Booking inquiries'
      }, {
        email: 'event@ths.kth.se', name: 'Party related'
      }, {
        email: 'restaurang@ths.kth.se', name: 'Nymble restaurants'
      }, {
        email: 'roger2@kth.se', name: 'Report a fault in Nymble'
      }, {
        email: 'naringsliv@ths.kth.se', name: 'Advertising'
      }, {
        email: 'webmaster@ths.kth.se', name: 'Webmaster'
      }, {
        email: 'kommunikation@ths.kth.se', name: 'Övrigt/Other'
      },
    ];
    this.error = null;
    this.success = null;
  }

  submitMessage(): void {
    this.error = null;
    this.success = null;
    if (this.contactForm.value.full_name === '' || this.contactForm.value.message === '' || this.contactForm.value.subject_to === '' || this.contactForm.value.subject_to === '---' ) {
      if (this.lang === 'en') {
        this.error = 'Please fill in the required fields (*)!';
      }else {
        this.error = 'Vänligen fyll i obligatoriska fält (*)!';
      }
    }else if (!this.contactForm.controls['email'].valid && this.contactForm.controls['email'].touched) {
      if (this.lang === 'en') {
        this.error = 'Please enter the correct email, this email is not valid.';
      }else {
        this.error = 'Vänligen ange rätt e-post.';
      }
    }else if (this.captcha.getResponse() === '') {
      if (this.lang === 'en') {
        this.error = 'Please resolve the reCAPTCHA and submit!';
      }else {
        this.error = 'Vänligen lösa reCAPTCHA och skicka in!';
      }
    }else {
      const post_data = {  // prepare payload for request
        'name': this.contactForm.value.full_name,
        'email': this.contactForm.value.email,
        'message': this.contactForm.value.message,
        'subject_to': this.contactForm.value.subject_to,
        'pnumber': this.contactForm.value.id_number,
        'g-recaptcha-response': this.captcha.getResponse()  // send g-captcah-reponse to our server
      };
      this.submitSubscription = this.contactFormService.submitMessage(post_data).subscribe(
          (res) => {
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
          }
      );
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
  }
}
