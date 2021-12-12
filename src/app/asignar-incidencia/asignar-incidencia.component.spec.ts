import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarIncidenciaComponent } from './asignar-incidencia.component';

describe('AsignarIncidenciaComponent', () => {
  let component: AsignarIncidenciaComponent;
  let fixture: ComponentFixture<AsignarIncidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarIncidenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarIncidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
