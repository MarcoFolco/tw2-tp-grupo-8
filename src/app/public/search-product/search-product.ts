import { Component } from '@angular/core';

@Component({
  selector: 'app-search-product',
  imports: [],
  templateUrl: './search-product.html',
})
export class SearchProduct {

  search($event: KeyboardEvent): void {
    console.log($event.key);
  }
}
