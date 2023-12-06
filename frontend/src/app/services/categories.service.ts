import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addCategory(category: Category): Observable<Category> {
    const url = `${this.apiUrl}/category`;
    return this.http.post<Category>(url, category);
  }

  getCategories(): Observable<Category[]> {
    const url = `${this.apiUrl}/categories`;
    return this.http.get<Category[]>(url);
  }

  getCategoryById(id: string): Observable<Category> {
    const url = `${this.apiUrl}/category/${id}`;
    return this.http.get<Category>(url);
  }

  updateCategory(category: Category): Observable<Category> {
    const url = `${this.apiUrl}/category/${category._id}`;
    return this.http.put<Category>(url, category);
  }

  deleteCategory(id: string): Observable<{}> {
    const url = `${this.apiUrl}/category/${id}`;
    return this.http.delete(url);
  }
}
