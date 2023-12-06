import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcategory } from '../models/subcategory.model';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addSubcategory(subcategory: Subcategory): Observable<Subcategory> {
    const url = `${this.apiUrl}/subcategory`;
    return this.http.post<Subcategory>(url, subcategory);
  }

  getSubcategories(): Observable<Subcategory[]> {
    const url = `${this.apiUrl}/subcategories`;
    return this.http.get<Subcategory[]>(url);
  }

  getSubcategoryById(id: string): Observable<Subcategory> {
    const url = `${this.apiUrl}/subcategory/${id}`;
    return this.http.get<Subcategory>(url);
  }

  updateSubcategory(subcategory: Subcategory): Observable<Subcategory> {
    const url = `${this.apiUrl}/subcategory/${subcategory._id}`;
    return this.http.put<Subcategory>(url, subcategory);
  }

  deleteSubategory(id: string): Observable<{}> {
    const url = `${this.apiUrl}/subcategory/${id}`;
    return this.http.delete(url);
  }
}
