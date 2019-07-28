import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDataFilterComponent } from './farmData-filter.component';

describe('FarmDataFilterComponent', () => {
  let component: FarmDataFilterComponent;
  let fixture: ComponentFixture<FarmDataFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FarmDataFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
