import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { PaintingService } from '../painting.service';
import { Painting } from '../paintings/paintings.component';

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

    constructor(private paintingService: PaintingService) {}
    // do API hardening here
    onSubmit() {
      if(this.painting.name == '' || this.painting.artist == '' || 
        this.painting.year == 0 || this.painting.image == '' || 
        this.painting.museum.first_displayed.name == '' || 
        this.painting.museum.current_location.name == '')
        return alert('Please enter all fields');
      
      this.paintingService.addPainting(this.painting).subscribe((data: Painting) => {
        console.log(data, "was added successfully");
        // notify user of success then redirect to /home
        alert('Painting added successfully');
        //  redirect to About page
        window.location.reload();

      });
    }  
}
