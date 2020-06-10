import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerChildComponent } from './container-child.component';

describe('ContainerChildComponent', () => {
  let component: ContainerChildComponent;
  let fixture: ComponentFixture<ContainerChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
