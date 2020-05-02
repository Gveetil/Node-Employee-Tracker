const departmentData = require('./database/departmentData')
const employeeTracker = require('./employeeTracker');

/** Object contains prompts used to fetch user input when working with department data */
const departmentPrompts = {
    add: {
        name: "name",
        message: "What is the name of the department?",
        validate: (val) => (val != null && val.trim() != "") ? true : "Please enter the name of the department!",
        filter: (val) => val.trim()
    },

    remove: {
        name: "departmentId",
        message: "Which department do you want to remove?",
        type: "list",
        choices: () => employeeTracker.getList('Department', departmentData.getDepartmentList),
    },

    totalUtilizedBudget: {
        name: "departmentId",
        message: "Which department do you want to view the total utilized budget of?",
        type: "list",
        choices: async () => employeeTracker.getList('Department', departmentData.getDepartmentList, true, "Select All Departments")
    },
};

/** This module provides methods to perform actions on departments
 * The functions in this module prompt the user for the required input 
 * and executes the requested action on the database */
const Department = {
    listAll: () => {
        return employeeTracker.execute(null, departmentData.fetchAllDepartments);
    },

    add: () => {
        return employeeTracker.execute(departmentPrompts.add, departmentData.addDepartment);
    },

    remove: () => {
        return employeeTracker.execute(departmentPrompts.remove, departmentData.removeDepartment);
    },

    getTotalUtilizedBudget: () => {
        return employeeTracker.execute(departmentPrompts.totalUtilizedBudget, departmentData.getTotalUtilizedBudget);
    },
}

module.exports = Department;