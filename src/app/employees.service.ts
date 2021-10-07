import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IEmployee {
  "employeeid": number,
  "firstname": string,
  "lastname": string,
  "birthdate": string,
  "startdate": string,
  "employeetype": string,
  "salary": number,
  "pvfrate": number
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

constructor(private http: HttpClient) { }
   onGetAllEmployee(){
    return this.http.get<IEmployee[]>("../assets/Employees.json");
   }

   
}
