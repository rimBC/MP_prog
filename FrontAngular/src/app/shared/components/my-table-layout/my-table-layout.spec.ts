import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTableLayout } from './my-table-layout';

describe('MyTableLayout', () => {
  let component: MyTableLayout;
  let fixture: ComponentFixture<MyTableLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTableLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(MyTableLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
