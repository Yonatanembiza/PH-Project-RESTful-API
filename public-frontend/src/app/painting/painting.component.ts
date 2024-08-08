import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-painting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painting.component.html',
  styleUrl: './painting.component.css'
})
export class PaintingComponent {
  painting: any;

}
