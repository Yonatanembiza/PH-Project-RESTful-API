import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-paintings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './paintings.component.html',
  styleUrl: './paintings.component.css'
})
export class PaintingsComponent {

  paintings: any;

}
