import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './public/header/header';
import { FooterComponent } from './public/footer/footer';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
