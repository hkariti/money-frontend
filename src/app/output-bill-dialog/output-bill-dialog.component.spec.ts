import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputBillDialogComponent } from './output-bill-dialog.component';

describe('OutputBillDialogComponent', () => {
  let component: OutputBillDialogComponent;
  let fixture: ComponentFixture<OutputBillDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputBillDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
