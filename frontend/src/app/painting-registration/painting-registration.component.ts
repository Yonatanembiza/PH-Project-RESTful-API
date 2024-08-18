import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { PaintingService } from '../painting.service';
import { Painting } from '../paintings/paintings.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-painting-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painting-registration.component.html',
  styleUrl: './painting-registration.component.css'
})
export class PaintingRegistrationComponent {
  painting = {
    name: '',
    artist: '',
    year: 0,
    image: '',
    museum: {
      first_displayed: {
        name: '',
        country: ''
      },
      current_location: {
        name: '',
        country: ''
      }
    }
  }

    constructor(private paintingService: PaintingService, private router: Router) {}
    // do API hardening here
    onSubmit() {
      if (
        this.painting.name.trim() === '' || 
        this.painting.artist.trim() === '' || 
        this.painting.year === 0 || 
        this.painting.image.trim() === '' || 
        this.painting.museum.first_displayed.name.trim() === '' || 
        this.painting.museum.current_location.name.trim() === ''
      ) {
        return alert('Please enter all fields');
      }
    
      this.paintingService.addPainting(this.painting).subscribe(
        (data: Painting) => {
          console.log(`Painting was added successfully`);
    
          // Notify the user of success
          alert('Painting added successfully');
    
          this.router.navigate(['/home']);
        },
        (err) => {
          if (err.status === 401) {
            return alert('Unauthorized: Invalid token');
          }
          if (err.status === 500) {
            return alert('Server error, please try again later');
          }
          if (err.status === 409) {
            return alert('Painting already exists');
          }
          alert('You have no permission to add to the collection.');
        }
      );
    }
}
