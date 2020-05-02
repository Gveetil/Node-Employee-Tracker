const employeeData = require('./database/employeeData')
const departmentData = require('./database/departmentData')
const roleData = require('./database/roleData')
const employeeTracker = require('./employeeTracker');

/** Object contains prompts used to fetch user input when working with employee data */
const employeePrompts = {
    add: [{
        name: "firstName",
        message: "What is the employee's first Name?",
        validate: (val) => (val != null && val.trim() != "") ? true : "Please enter the employee's first name!",
        filter: (val) => val.trim()
    }, {
        name: "lastName",
        message: "What is the employee's last Name?",
        validate: (val) => (val != null && val.trim() != "") ? true : "Please enter the employee's last name!",
        filter: (val) => val.trim()
    }, {
        name: "roleId",
        message: "What is the employee's role?",
        type: "list",
        choices: () => employeeTracker.getList('Role', roleData.getRoleList),
    }, {
        name: "managerId",
        message: "Who is the employee's manager?",
        type: "list",
        when: (data) => (data.roleId > 0),
        choices: () => employeeTracker.getList('Manager', employeeData.getEmployeeList, true, "No Manager"),
    }],

    remove: {
        name: "employeeId",
        message: "Which employee do you want to remove?",
        type: "list",
        choices: () => employeeTracker.getList('Employee', employeeData.getEmployeeList),
    },

    updateManager: [{
        name: "employeeId",
        message: "Which employee's manager do you want to update?",
        type: "list",
        choices: () => employeeTracker.getList('Employee', employeeData.getEmployeeList),
    }, {
        name: "managerId",
        message: "Which employee do you want to set as manager for the selected employee?",
        type: "list",
        when: (data) => (data.employeeId > 0),
        choices: async (data) => {
            // Ensure that the selected employee is not listed in the manager list 
            const listData = await employeeTracker.getList('Manager', employeeData.getEmployeeList, true, "No Manager");
            return listData.filter(element => element.value != data.employeeId);
        },
    }],

    updateRole: [{
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        type: "list",
        choices: () => employeeTracker.getList('Employee', employeeData.getEmployeeList),
    }, {
        name: "roleId",
        message: "What is the employee's new role?",
        type: "list",
        when: (data) => (data.employeeId > 0),
        choices: () => employeeTracker.getList('Role', roleData.getRoleList),
    }],

    selectDepartment: {
        name: "departmentId",
        message: "Select a department ...",
        type: "list",
        choices: () => employeeTracker.getList('Department', departmentData.getDepartmentList),
    },

    selectManager: {
        name: "managerId",
        message: "Select a manager ...",
        type: "list",
        choices: () => employeeTracker.getList('Manager', employeeData.getManagerList, true, "Not Assigned"),
    },
}

/** This module provides methods to perform actions on Employees
 * The functions in this module prompt the user for the required input 
 * and executes the requested action on the database */
const Employee = {
    listAll: () => {
        return employeeTracker.execute(null, employeeData.fetchAllEmployees);
    },

    listByDepartment: () => {
        return employeeTracker.execute(employeePrompts.selectDepartment, employeeData.fetchEmployeesByDepartment);
    },

    listByManager: () => {
        return employeeTracker.execute(employeePrompts.selectManager, employeeData.fetchEmployeesByManager);
    },

    add: () => {
        return employeeTracker.execute(employeePrompts.add, employeeData.addEmployee);
    },

    remove: () => {
        return employeeTracker.execute(employeePrompts.remove, employeeData.removeEmployee);
    },

    updateRole: () => {
        return employeeTracker.execute(employeePrompts.updateRole, employeeData.updateRole);
    },

    updateManager: () => {
        return employeeTracker.execute(employeePrompts.updateManager, employeeData.updateManager);
    },
}

module.exports = Employee;