import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { Producto } from '../../interfaces/producto.interface';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

export type ProductoFormData = {
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoriaId: number;
};

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, Select, InputText, Button],
  templateUrl: './product-form.html',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);
  private destroyRef = inject(DestroyRef);

  producto = input<Producto | undefined>(undefined);
  formSubmit = output<ProductoFormData>();

  form!: FormGroup;
  categorias: Categoria[] = [];

  ngOnInit() {
    const p = this.producto();

    this.form = this.fb.group({
      nombre: [p?.nombre ?? '', Validators.required],
      slug: [p?.slug ?? '', Validators.required],
      descripcion: [p?.descripcion ?? ''],
      precio: [p?.precio ?? 0, [Validators.required, Validators.min(0)]],
      stock: [p?.stock ?? 0, [Validators.required, Validators.min(0)]],
      imagenUrl: [p?.imagenUrl ?? ''],
      categoriaId: [p?.categoria?.id ?? null, Validators.required],
    });

    this.categoriesService.getCategorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cats) => this.categorias = cats,
      });
  }

  enviar() {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.value as ProductoFormData);
  }
}
