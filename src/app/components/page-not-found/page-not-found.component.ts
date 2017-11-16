import { Component, OnInit } from '@angular/core';
import {HeaderCommunicationService} from "../../services/component-communicators/header-communication.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private headerCommunicationService: HeaderCommunicationService) { }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
  }

}
