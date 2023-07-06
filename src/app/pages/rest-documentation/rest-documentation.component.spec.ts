import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestDocumentationComponent } from './rest-documentation.component';

describe('RestDocumentationComponent', () => {
  let component: RestDocumentationComponent;
  let fixture: ComponentFixture<RestDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestDocumentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
