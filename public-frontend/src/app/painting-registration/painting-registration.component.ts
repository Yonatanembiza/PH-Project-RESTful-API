import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-painting-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painting-registration.component.html',
  styleUrl: './painting-registration.component.css'
})
export class PaintingRegistrationComponent {
  painting= {
    name: '',
    artist: '',
    year: '',
    image: '',
    museum: {
      first_displayed: {
        first_displayed: '',
        first_displayed_country: ''
      },
      current_location: {
        current_location_name: '',
        current_location_country: ''
      }
    }
  }
  onSubmit() {
    console.log(this.painting);
  }
  
}
