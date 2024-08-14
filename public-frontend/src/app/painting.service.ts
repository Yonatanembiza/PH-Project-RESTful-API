import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private _baseUrl = environment.apiUrl + '/paintings';

  constructor(private _httpClient: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }
  getPaintings() {
    return this._httpClient.get<any>(`${this._baseUrl}`);
  }

  getPaintingByName(name: string) {
    return this._httpClient.get<any>(`${this._baseUrl}/name/${name}`);
  }
  getPaintingById(id: number) {
    return this._httpClient.get<any>(`${this._baseUrl}/id/${id}`);
  }

  addPainting(painting: any) {
    console.log(painting);
    return this._httpClient.post<any>(`${this._baseUrl}`, painting, {headers: this.getHeaders().headers});
  }
  addMuseumByPaintingId(paintingId: number, museum: any) {
    return this._httpClient.post<any>(`${this._baseUrl}/id/${paintingId}/museum`, museum, {headers: this.getHeaders().headers});
  }
  deletePaintingById(id: number) {
    return this._httpClient.delete<any>(`${this._baseUrl}/id/${id}`, {headers: this.getHeaders().headers});
  }
  //
  deletePaintingByName(name: string) {
    return this._httpClient.delete<any>(`${this._baseUrl}/name/${name}`, {headers: this.getHeaders().headers});
  }
  updatePaintingById(id: number, painting: any) {
    return this._httpClient.put<any>(`${this._baseUrl}/id/${id}`, painting, {headers: this.getHeaders().headers});
  }
  updatePaintingByName(name: string, painting: any) {
    return this._httpClient.put<any>(`${this._baseUrl}/name/${name}`, painting, {headers: this.getHeaders().headers});
  }
}
