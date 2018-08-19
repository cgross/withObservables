# withObservables

> Replace Redux with RxJS using this simple React HOC.

Redux has a ton of boilerplace, for benefits you probably don't need.  Instead use RxJS to replace Redux with your own simply coded state stores.  Then use this HOC to connect your state stores to your components.

## Installation

```bash
npm install @cgross/with-observables
```

## API

withObservables(reactComponent,mapOfObservables)

* reactComponent - Your React class or function that you want to connect to observables.
* mapOfObservables - An object whose values are RxJS Observables.  Each observable in the object will be subscribed to and its values passed as props to the wrapped component.  They key name in the map will be used as the prop name.

## State stores with RxJS

A state store is store of data that notifies its dependents when that data changes.  An RxJS ReplaySubject works very well as a state store.  A ReplaySubject is a multicasting (sends to many) stream that always replays X of its last events to new subscribers.  Use a ReplaySubject where X = 1 to create a simple but powerful RxJS state store.

Here's a simple example:

```js
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
```


That's a boilerplate free state store that encapsulates both the current state of the employee list as well as the logic to both retrieve and update that state.  

Now use withObservables to connect that state store to a React component:

```js
import React from 'react';
import employeeService from './EmployeeService';
import withObservables from 'with-observables';

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
                <span>{emp.name}</span> 
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

```

Now the EmployeeList component will rerender anytime the EmployeeService emits a state change.  EmployeeList is a pure (non-stateful) component.

Your application can have any number of state stores/services.  A component can connect to any number of them as well.  You can use the full power of RxJS operators to combine/filter/reduce/etc different streams.  There also isn't a requirement to use ReplaySubject when using withObservables (but they work great as state stores).
