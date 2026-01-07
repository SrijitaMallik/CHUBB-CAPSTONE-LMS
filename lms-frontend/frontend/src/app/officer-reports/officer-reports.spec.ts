import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerReports } from './officer-reports';

describe('OfficerReports', () => {
  let component: OfficerReports;
  let fixture: ComponentFixture<OfficerReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
