import { TestBed, inject } from '@angular/core/testing';

import { ChaptersAssociationsService } from './chapters-associations.service';

describe('ChaptersAssociationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChaptersAssociationsService]
    });
  });

  it('should be created', inject([ChaptersAssociationsService], (service: ChaptersAssociationsService) => {
    expect(service).toBeTruthy();
  }));
});
