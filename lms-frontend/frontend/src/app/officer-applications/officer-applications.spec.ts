import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerApplications } from './officer-applications';

describe('OfficerApplications', () => {
  let component: OfficerApplications;
  let fixture: ComponentFixture<OfficerApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
