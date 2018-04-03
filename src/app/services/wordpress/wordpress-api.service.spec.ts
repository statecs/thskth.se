import { TestBed, inject } from '@angular/core/testing';

import { WordpressApiService } from './wordpress-api.service';

describe('WordpressApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordpressApiService]
    });
  });

  it('should ...', inject([WordpressApiService], (service: WordpressApiService) => {
    expect(service).toBeTruthy();
  }));
});
