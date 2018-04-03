import {Component, Input, OnInit} from '@angular/core';
import {ImageGallery} from '../../interfaces/page';

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
