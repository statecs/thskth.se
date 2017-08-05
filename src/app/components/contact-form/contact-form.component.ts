import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  public subjects: object[];

  constructor() {
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
        name: 'restaurang@ths.kth.se', email: 'Nymble restaurant'
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
  }

  ngOnInit() {
  }

}
