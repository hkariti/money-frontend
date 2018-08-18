import { TestBed, inject } from '@angular/core/testing';

import { DjangoFetchService } from './django-fetch.service';

describe('DjangoFetchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DjangoFetchService]
    });
  });

  it('should be created', inject([DjangoFetchService], (service: DjangoFetchService) => {
    expect(service).toBeTruthy();
  }));
});
