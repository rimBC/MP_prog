import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParticipants } from './manage-participants';

describe('ManageParticipants', () => {
  let component: ManageParticipants;
  let fixture: ComponentFixture<ManageParticipants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageParticipants],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageParticipants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
