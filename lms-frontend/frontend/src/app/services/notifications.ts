import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  api = 'http://localhost:5209/api/notifications';

  constructor(private http:HttpClient) {}

  getMyNotifications(){
    return this.http.get<any[]>(this.api);
  }

  markRead(id:number){
    return this.http.put(`${this.api}/${id}/read`,{});
  }
}
