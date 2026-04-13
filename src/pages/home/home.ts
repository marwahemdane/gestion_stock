import { Component } from "@angular/core";
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  templateUrl: 'home.html',
  imports: [
    MatButtonModule,
    RouterLink
  ],
  standalone: true
})
export class HomePage {}