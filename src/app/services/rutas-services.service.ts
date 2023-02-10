import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Respuesta } from '../interface/respuesta.interface';
import { Flight } from '../interface/ruta.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RutasServicesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  obtenerRutas():Observable<Respuesta[]>{
    return this.http.get<Respuesta[]>(`${this.baseUrl}/2`)
  }
}
