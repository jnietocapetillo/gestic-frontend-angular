import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleUsuarioAdminComponent } from './detalle-usuario-admin.component';

describe('DetalleUsuarioAdminComponent', () => {
  let component: DetalleUsuarioAdminComponent;
  let fixture: ComponentFixture<DetalleUsuarioAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleUsuarioAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleUsuarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
