import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecodarPasswordComponent } from './recodar-password.component';

describe('RecodarPasswordComponent', () => {
  let component: RecodarPasswordComponent;
  let fixture: ComponentFixture<RecodarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecodarPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecodarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
