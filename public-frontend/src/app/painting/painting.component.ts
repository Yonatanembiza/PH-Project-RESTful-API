import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Painting } from '../paintings/paintings.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PaintingService } from '../painting.service';

@Component({
  selector: 'app-painting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painting.component.html',
  styleUrl: './painting.component.css'
})
export class PaintingComponent implements OnInit {
  painting!: Painting;

  constructor(private activatedRoute: ActivatedRoute, 
    private paintingService: PaintingService, 
    private router: Router) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    
    if (!id) {
      alert('Painting not found');
      return;
    }
  
    this.paintingService.getPaintingById(id).subscribe(
      (data: Painting) => {
        this.painting = data;
      },
      (err) => {
        console.error('Error fetching painting:', err);
        alert('An error occurred while fetching the painting.');
      }
    );
  }
  deletePainting() {
    const id = this.activatedRoute.snapshot.params['id'];
  
    if (!id) {
      alert('Painting not found');
      return;
    }
  
    if (confirm('Are you sure you want to delete this painting?')) {
      this.paintingService.deletePaintingById(id).subscribe(
        () => {
          alert('Painting with id ' + id + ' was deleted successfully');
          this.router.navigate(['/home']); // Redirect to the /home page
        },
        (err) => {
          console.error('Error deleting painting:', err);
          alert('You are have no permission to delete this painting.');
        }
      );
    }
  }
}

