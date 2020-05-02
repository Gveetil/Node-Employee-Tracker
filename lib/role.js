const roleData = require('./database/roleData')
const departmentData = require('./database/departmentData')
const employeeTracker = require('./employeeTracker');

// The max salary allowed in the system
const maxSalary = 100000000;

/** Object contains prompts used to fetch user input when working with role data */
const rolePrompts = {
    add: [{
        name: "title",
        message: "What is the title of the role?",
        validate: (val) => (val != null && val.trim() != "") ? true : "Please enter the title of the role!",
        filter: (val) => val.trim()
    }, {
        name: "salary",
        message: "What is the salary for this role?",
        validate: (val) => (parseFloat(val) > 0 && parseFloat(val) < maxSalary) ? true : "Salary should be a valid number!",
        filter: (val) => (parseFloat(val) > 0 && parseFloat(val) < maxSalary) ? parseFloat(val) : ""
    }, {
        name: "departmentId",
        message: "Which department does this role belong to?",
        type: "list",
        choices: () => employeeTracker.getList('Department', departmentData.getDepartmentList),
    }],

    remove: {
        name: "roleId",
        message: "Which role do you want to remove?",
        type: "list",
        choices: () => employeeTracker.getList('Role', roleData.getRoleList),
    }
};

/** This module provides methods to perform actions on roles
 * The functions in this module prompt the user for the required input 
 * and executes the requested action on the database */
const Role = {
    listAll: () => {
        return employeeTracker.execute(null, roleData.fetchAllRoles);
    },

    add: () => {
        return employeeTracker.execute(rolePrompts.add, roleData.addRole);
    },

    remove: () => {
        return employeeTracker.execute(rolePrompts.remove, roleData.removeRole);
    },
}

module.exports = Role;