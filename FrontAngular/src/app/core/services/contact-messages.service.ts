import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/message-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactMessagesService {
  
 private apiUrl="http://localhost:3000/api";
 
 constructor(private http:HttpClient) {}

 sendMessage(body:Message):Observable<any> {
  return this.http.post(this.apiUrl+'/messages',body);
 }

}
