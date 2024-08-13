import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private baseUrl = environment.apiUrl + '/paintings';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }
  getPaintings() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getPaintingByName(name: string) {
    return this.http.get<any>(`${this.baseUrl}/name/${name}`);
  }
  getPaintingById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/id/${id}`);
  }

  addPainting(painting: any) {
    console.log(painting);
    return this.http.post<any>(`${this.baseUrl}`, painting, {headers: this.getHeaders().headers});
  }
  addMuseumByPaintingId(paintingId: number, museum: any) {
    return this.http.post<any>(`${this.baseUrl}/id/${paintingId}/museum`, museum, {headers: this.getHeaders().headers});
  }
  deletePaintingById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/id/${id}`, {headers: this.getHeaders().headers});
  }
  //
  deletePaintingByName(name: string) {
    return this.http.delete<any>(`${this.baseUrl}/name/${name}`, {headers: this.getHeaders().headers});
  }
  updatePaintingById(id: number, painting: any) {
    return this.http.put<any>(`${this.baseUrl}/id/${id}`, painting, {headers: this.getHeaders().headers});
  }
  updatePaintingByName(name: string, painting: any) {
    return this.http.put<any>(`${this.baseUrl}/name/${name}`, painting, {headers: this.getHeaders().headers});
  }
}
