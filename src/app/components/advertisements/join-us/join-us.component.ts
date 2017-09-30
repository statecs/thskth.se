import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss']
})
export class JoinUsComponent implements OnInit {

  constructor(private router: Router) { }

  goToPage(slug): void {
    this.router.navigate(['/' + slug]);
  }

  ngOnInit() {
  }

}
