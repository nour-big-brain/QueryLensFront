import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiBaseUrl: string = 'http://localhost:5000/roles';

  constructor(private http: HttpClient) {

  }
  //transform any to required class later
  createRole(role:any):Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, role);
  }
  getRoles():Observable<any[]> {
    return this.http.get<any[]>(this.apiBaseUrl);
  }
  getRoleById(id:string):Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
  }
  updateRole(id:string, role:any):Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/${id}`, role);
  }
  deleteRole(id:string):Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${id}`);
  }
  addPermissionToRole(roleId:string, permission:any):Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/${roleId}/permissions/add`, { permission });
  }
  removePermissionFromRole(roleId:string, permission:any):Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/${roleId}/permissions/remove`, { permission });
  }
}
