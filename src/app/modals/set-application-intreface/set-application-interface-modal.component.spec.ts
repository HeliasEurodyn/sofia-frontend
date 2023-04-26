import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetApplicationInterfaceModalComponent } from './set-application-interface-modal.component';

describe('RemoveElementModalComponent', () => {
  let component: SetApplicationInterfaceModalComponent;
  let fixture: ComponentFixture<SetApplicationInterfaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetApplicationInterfaceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetApplicationInterfaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
