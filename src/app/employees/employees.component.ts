import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees.service';
import moment from 'moment';
import { EEmployeeType, EContributionType } from '../enum-employees';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employeeData= [];
  annualInterestRate = 2;
  companyPvfRate = 10;

  public get EEmployeeType(): typeof EEmployeeType {
    return EEmployeeType;
  }

  public get EContributionType(): typeof EContributionType {
    return EContributionType;
  }

  constructor(private empService: EmployeesService) {}

  ngOnInit(): void {
    this.empService.onGetAllEmployee().subscribe(res=>{
      this.employeeData =  res
    });
  }

  formatCalculateAge(date) {
    const year = Math.floor(this.calculateDateAsMonth(date) / 12);
    const month = this.calculateDateAsMonth(date) % 12;
    return `${year} year(s) ${month} month(s)`;
  }

  calculateDateAsMonth(date) {
    return moment().diff(moment(date, 'DD/MM/YYYY'), 'month');
  }

  getContribution(emp, contributionType) {
    if (emp.employeetype !== EEmployeeType.permanent) return 0;
    const calculatedMonth = this.calculateDateAsMonth(emp.startdate) - 3;
    const rate = contributionType === EContributionType.employee ? emp.pvfrate : this.companyPvfRate;
    const total = this.calculateTotalAmount(rate, emp.salary) * calculatedMonth;
    return total;
  }

  getInterest(emp) {
    if (emp.employeetype !== EEmployeeType.permanent) return 0;
    const employedYear = Math.floor(this.calculateDateAsMonth(emp.startdate) / 12);
    const totalContribution =
      this.calculateTotalAmount(emp.pvfrate, emp.salary) * employedYear * 12 +
      this.calculateTotalAmount(this.companyPvfRate, emp.salary) * employedYear * 12;
    const total =
      totalContribution *
      this.calculateTotalAmount(this.annualInterestRate, employedYear);
    return total;
  }

  getActualPvf(emp) {
    if (emp.employeetype !== EEmployeeType.permanent) return 0;
    const employedYear = this.calculateDateAsMonth(emp.startdate) / 12 || 0;

    if (employedYear < 3) {
      return this.getContribution(emp, EContributionType.employee) + this.getInterest(emp);
    } else if (employedYear < 5) {
      return (this.getContribution(emp, EContributionType.company) * 0.5) + this.getContribution(emp, EContributionType.employee) + this.getInterest(emp);
    } else {
      return this.getContribution(emp, EContributionType.company) + this.getContribution(emp, EContributionType.employee) + this.getInterest(emp);
    }
  }

  calculateTotalAmount(percent, number) {
    return (percent / 100) * number;
  }
}
