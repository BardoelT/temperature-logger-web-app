import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadiconComponent } from './load-icon.component';

describe('LoadiconComponent', () => {
  let component: LoadiconComponent;
  let fixture: ComponentFixture<LoadiconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadiconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadiconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
