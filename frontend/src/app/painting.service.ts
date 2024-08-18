import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private _baseUrl = environment.apiUrl + '/paintings';

  constructor(private _httpClient: HttpClient) { }

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
    return this._httpClient.post<any>(`${this._baseUrl}`, painting);
  }
  addMuseumByPaintingId(paintingId: number, museum: any) {
    return this._httpClient.post<any>(`${this._baseUrl}/id/${paintingId}/museum`, museum);
  }
  deletePaintingById(id: number) {
    return this._httpClient.delete<any>(`${this._baseUrl}/id/${id}`); 
  }
  //
  deletePaintingByName(name: string) {
    return this._httpClient.delete<any>(`${this._baseUrl}/name/${name}`); 
  }
  updatePaintingById(id: number, painting: any) {
    return this._httpClient.put<any>(`${this._baseUrl}/id/${id}`, painting); 
  }
  updatePaintingByName(name: string, painting: any) {
    return this._httpClient.put<any>(`${this._baseUrl}/name/${name}`, painting); 
  }
}
