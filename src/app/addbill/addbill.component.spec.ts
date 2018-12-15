import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbillComponent } from './addbill.component';

describe('AddbillComponent', () => {
  let component: AddbillComponent;
  let fixture: ComponentFixture<AddbillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
