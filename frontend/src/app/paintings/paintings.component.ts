import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaintingService } from '../painting.service';

@Component({
  selector: 'app-paintings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './paintings.component.html',
  styleUrls: ['./paintings.component.css']
})
export class PaintingsComponent {

  paintings: Painting[] = [];
  displayedPaintings: Painting[] = [];
  currentPage: number = 1;
  paintingsPerPage: number = 10;

  constructor(private paintingService: PaintingService) { }

  ngOnInit() {
    // retrieve savedPage from localStorage
    const savedPage = localStorage.getItem('savedPage');
    this.currentPage = savedPage ? parseInt(savedPage) : 1;
    this.paintingService.getPaintings().subscribe((data: Painting[]) => {
      this.paintings = data;
      this.updateDisplayedPaintings();
    });
  }

  updateDisplayedPaintings() {
    const startIndex = (this.currentPage - 1) * this.paintingsPerPage;
    const endIndex = startIndex + this.paintingsPerPage;
    this.displayedPaintings = this.paintings.slice(startIndex, endIndex);

    // save the current page to localStorage
    localStorage.setItem('savedPage', this.currentPage.toString());
  }

  nextPage() {
    if (this.currentPage * this.paintingsPerPage < this.paintings.length) {
      this.currentPage++;
      this.updateDisplayedPaintings();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPaintings();
    }
  }
}

export class Location {
  constructor(
    public name: string,
    public country: string
  ) {}
}

export class Museum {
  constructor(
    public first_displayed: Location,
    public current_location: Location
  ) {}
}

export class Painting {
  constructor(
    public _id: string,
    public name: string,
    public artist: string,
    public year: number,
    public image?: string,
    public museum?: Museum
  ) {}
}