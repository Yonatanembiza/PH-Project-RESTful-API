import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Painting } from './paintings/paintings.component';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private baseUrl = 'http://localhost:3000/api/paintings';
  constructor(private http: HttpClient) { }

  getPaintings() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getPaintingByName(name: string) {
    return this.http.get<any>(`${this.baseUrl}/${name}`);
  }
  getPaintingById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addPainting(painting: any) {
    console.log(painting);
    return this.http.post<any>(`${this.baseUrl}`, painting);
  }
  addMuseumByPaintingId(paintingId: number, museum: any) {
    return this.http.post<any>(`${this.baseUrl}/${paintingId}/museum`, museum);
  }
  deletePaintingById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  deletePaintingByName(name: string) {
    return this.http.delete<any>(`${this.baseUrl}/${name}`);
  }
  updatePaintingById(id: number, painting: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, painting);
  }
  updatePaintingByName(name: string, painting: any) {
    return this.http.put<any>(`${this.baseUrl}/${name}`, painting);
  }
  // previous five paintings

  // next five paintings
  
}
