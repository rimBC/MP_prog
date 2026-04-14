import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFormation } from './manage-formation';

describe('ManageFormation', () => {
  let component: ManageFormation;
  let fixture: ComponentFixture<ManageFormation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFormation],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFormation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
