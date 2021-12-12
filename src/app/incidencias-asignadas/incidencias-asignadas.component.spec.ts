import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciasAsignadasComponent } from './incidencias-asignadas.component';

describe('IncidenciasAsignadasComponent', () => {
  let component: IncidenciasAsignadasComponent;
  let fixture: ComponentFixture<IncidenciasAsignadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidenciasAsignadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciasAsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
