import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Painting } from '../paintings/paintings.component';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private activatedRoute: ActivatedRoute, private paintingService: PaintingService) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id == null) {
      alert('Painting not found');
      return;
    }
    this.paintingService.getPaintingById(id).subscribe((data: Painting) => {
      this.painting = data;
    });
  }
  deletePainting() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id == null) {
      alert('Painting not found');
      return;
    }
    this.paintingService.deletePaintingById(id).subscribe((data: Painting) => {
      this.painting = data;
      alert('Painting with id ' + id + ' was deleted successfully');
      window.location.reload();
    });
  }
}

