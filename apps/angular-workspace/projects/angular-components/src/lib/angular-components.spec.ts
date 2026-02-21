import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularComponents } from './angular-components';

describe('AngularComponents', () => {
  let component: AngularComponents;
  let fixture: ComponentFixture<AngularComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
