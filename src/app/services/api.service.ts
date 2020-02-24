import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GitRepository } from '../models/GitRepository';
import { Observable } from 'rxjs/internal/Observable';
import { Branch } from '../models/Branch';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getUserRepositories(username: string): Observable<GitRepository[]> {
    const headers = this.createHeaders();
    const url = `https://api.github.com/users/${username}/repos`;
    return this.httpClient.get<GitRepository[]>(url, { headers });
  }

  getRepositoryBranches(repositoryName: string, username: string): Observable<Branch[]> {
    const url = `https://api.github.com/repos/${username}/${repositoryName}/branches`;
    return this.httpClient.get<Branch[]>(url);
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.inertia-preview+json'
    });
  }
}

