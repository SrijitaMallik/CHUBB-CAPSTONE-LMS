import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOfficers } from './pending-officers';

describe('PendingOfficers', () => {
  let component: PendingOfficers;
  let fixture: ComponentFixture<PendingOfficers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingOfficers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingOfficers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
