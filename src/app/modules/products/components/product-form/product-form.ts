import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../interfaces/categoria.interface';
import { Producto } from '../../interfaces/producto.interface';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

export type ProductoFormData = {
  nombre: string;
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

  producto = input<Producto | undefined>(undefined);
  categorias = input<Categoria[]>([]);
  formSubmit = output<ProductoFormData>();

  form!: FormGroup;

  ngOnInit() {
    const p = this.producto();

    this.form = this.fb.group({
      nombre: [p?.nombre ?? '', Validators.required],
      descripcion: [p?.descripcion ?? ''],
      precio: [p?.precio ?? null, [Validators.required, Validators.min(0.01)]],
      stock: [p?.stock ?? null, [Validators.required, Validators.min(0)]],
      imagenUrl: [p?.imagenUrl ?? ''],
      categoriaId: [p?.categoria?.id ?? null, Validators.required],
    });
  }

  enviar() {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.value as ProductoFormData);
  }
}
