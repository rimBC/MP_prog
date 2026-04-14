import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFormateur } from './manage-formateur';

describe('ManageFormateur', () => {
  let component: ManageFormateur;
  let fixture: ComponentFixture<ManageFormateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFormateur],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFormateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
