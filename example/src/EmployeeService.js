import {ReplaySubject} from 'rxjs';
import * as _ from 'lodash';

/**
 * ReplaySubject is very important!  They work well as state stores as they
 * emit the most recent event (i.e. state) when a new subscriber connects.
 */
var employeesSubject = new ReplaySubject(1);
var employees = [];

class EmployeeService {

    getEmployeesObservable() {
        return employeesSubject.asObservable();
    }

    retrieveEmployees() {
        //Code here could make a REST call
        //you would just call employeesSubject.next(...) in
        //the REST callback
        employees = [{
            id:1,
            name:'Homer Simpson'
        },{
            id:2,
            name:'Marge Simpson'
        }, {
            id:3,
            name:'Bart Simpson'
        }, {
            id:4,
            name:'Lisa Simpson'
        }, {
            id:5,
            name:'Magee Simpson'
        }];
        employeesSubject.next(employees);
    }

    updateEmployee(employee) {
        //create a new array replacing the modified employee
        employees = _.map(employees,function(emp) {
            return emp.id === employee.id ? employee : emp;
        });
        employeesSubject.next(employees);
    }

    deleteEmployee(employee) {
        //create a new array removing the  employee
        employees = _.reject(employees,{id:employee.id});
        employeesSubject.next(employees);
    }

};

var employeeService = new EmployeeService();
export default employeeService;