import React from 'react';
import employeeService from './EmployeeService';
import withObservables from './withObservables.js';

const observables = {
  employees:employeeService.getEmployeesObservable()
};

class EmployeeList extends React.Component {

  componentDidMount() {
    employeeService.retrieveEmployees();
  }

  deleteEmployee(emp) {
    employeeService.deleteEmployee(emp);
  }

  changeName(emp) {
    var newName = window.prompt('Enter the new name:',emp.name);
    var newEmp = { ...emp }; //clone
    newEmp.name = newName;
    employeeService.updateEmployee(newEmp);
  }

  render() {
    return (
      <div>
        {
          this.props.employees &&
          this.props.employees.map((emp) => {
            return (
              <div key={emp.id}>
                <span style={{display:'inline-block',width:250}}>{emp.name}</span> 
                <button type="button" onClick={() => this.changeName(emp)}>Change Name</button> 
                <button type="button" onClick={() => this.deleteEmployee(emp)}>Delete</button>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default withObservables(EmployeeList, observables);
