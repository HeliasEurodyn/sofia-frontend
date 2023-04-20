import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPluginComponent } from './ui-plugin.component';

describe('UiPluginComponent', () => {
  let component: UiPluginComponent;
  let fixture: ComponentFixture<UiPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiPluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
