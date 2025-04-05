import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSegmentComponent } from './transaction-segment.component';

describe('TransactionSegmentComponent', () => {
  let component: TransactionSegmentComponent;
  let fixture: ComponentFixture<TransactionSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSegmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
