import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilerowComponent } from './filerow.component';

describe('FilerowComponent', () => {
  let component: FilerowComponent;
  let fixture: ComponentFixture<FilerowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilerowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilerowComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
