import {Component, Input, OnInit} from '@angular/core';
import {TextGallery} from '../../interfaces-and-classes/gallery';

@Component({
  selector: 'app-text-gallery',
  templateUrl: './text-gallery.component.html',
  styleUrls: ['./text-gallery.component.scss']
})
export class TextGalleryComponent implements OnInit {
  @Input() textGallery: TextGallery;

  constructor() { }

  ngOnInit() {
  }

}
