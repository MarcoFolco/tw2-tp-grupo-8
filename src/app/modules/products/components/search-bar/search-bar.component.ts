import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  searchControl = new FormControl('', { nonNullable: true });

  @Output() searchChanged = new EventEmitter<string>();

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(value => {
      this.searchChanged.emit(value);
    });
  }

  clear() {
    this.searchControl.setValue('');
  }
}
