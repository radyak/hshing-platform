import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { DockerContainer } from '../model/DockerContainer';

@Injectable({
  providedIn: 'root'
})
export class DockerContainerService {

  constructor(private http: HttpClient) { }

  getContainers(): Observable<DockerContainer[]> {
    return this.http.get<DockerContainer[]>('http://localhost:3001/api/containers')
  }

  getContainer(name: string): Observable<DockerContainer> {
    return this.http.get<DockerContainer>(`http://localhost:3001/api/containers/${name}`)
  }

  stopContainer(name: string): Observable<DockerContainer> {
    return this.http.post<DockerContainer>(`http://localhost:3001/api/containers/${name}/stop`, {})
  }

  startContainer(name: string): Observable<DockerContainer> {
    return this.http.post<DockerContainer>(`http://localhost:3001/api/containers/${name}/start`, {})
  }

}
