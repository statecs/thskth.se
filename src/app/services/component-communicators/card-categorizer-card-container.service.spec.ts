import { TestBed, inject } from '@angular/core/testing';

import { CardCategorizerCardContainerService } from './card-categorizer-card-container.service';

describe('CardCategorizerCardContainerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardCategorizerCardContainerService]
    });
  });

  it('should ...', inject([CardCategorizerCardContainerService], (service: CardCategorizerCardContainerService) => {
    expect(service).toBeTruthy();
  }));
});
