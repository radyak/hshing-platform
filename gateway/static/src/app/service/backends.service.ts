import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Backend } from '../model/Backend';

@Injectable({
  providedIn: 'root'
})
export class BackendsService {

  private baseUrl: string = 'http://localhost';

  constructor(private http: HttpClient) { }

  getBackends(): Observable<Backend[]> {
    return this.http.get<Backend[]>(`${this.baseUrl}/api/backends`)
  }

  getBackend(name: string): Observable<Backend> {
    return this.http.get<Backend>(`${this.baseUrl}/api/backends/${name}`)
  }

  stopBackend(name: string): Observable<Backend> {
    return this.http.post<Backend>(`${this.baseUrl}/api/backends/${name}/stop`, {})
  }

  startBackend(name: string): Observable<Backend> {
    return this.http.post<Backend>(`${this.baseUrl}/api/backends/${name}/start`, {})
  }

}
