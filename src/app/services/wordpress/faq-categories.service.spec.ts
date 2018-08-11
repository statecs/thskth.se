import { TestBed, inject } from '@angular/core/testing';

import { FaqCategoriesService } from './faq-categories.service';

describe('FaqCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FaqCategoriesService]
    });
  });

  it('should be created', inject([FaqCategoriesService], (service: FaqCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
