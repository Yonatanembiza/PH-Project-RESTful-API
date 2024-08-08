import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-painting-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painting-registration.component.html',
  styleUrl: './painting-registration.component.css'
})
export class PaintingRegistrationComponent {

}
