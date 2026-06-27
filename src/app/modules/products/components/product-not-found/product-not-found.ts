import { HttpErrorResponse } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-not-found',
  imports: [RouterLink],
  templateUrl: './product-not-found.html',
})
export class ProductNotFound {
  readonly error = input.required<HttpErrorResponse | null>();
}
