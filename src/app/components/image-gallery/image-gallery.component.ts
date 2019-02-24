import {Component, Input, OnInit} from '@angular/core';
import {ImageGallery} from '../../interfaces-and-classes/gallery';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  @Input() imageGallery: ImageGallery;

  constructor() { }

  ngOnInit() {
  }

}
