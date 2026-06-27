import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-email-enviado-page',
  templateUrl: './email-enviado.html',
  imports: [RouterLink, Card, Button],
})
export class EmailEnviadoPage {}
