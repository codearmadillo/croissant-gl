import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldableSectionComponent } from './foldable-section.component';

describe('FoldableSectionComponent', () => {
  let component: FoldableSectionComponent;
  let fixture: ComponentFixture<FoldableSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoldableSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FoldableSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
