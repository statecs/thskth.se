import { TestBed, inject } from '@angular/core/testing';

import { SocialMediaPostService } from './social-media-post.service';

describe('SocialMediaPostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialMediaPostService]
    });
  });

  it('should be created', inject([SocialMediaPostService], (service: SocialMediaPostService) => {
    expect(service).toBeTruthy();
  }));
});
