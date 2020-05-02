const employeeData = require('../database/employeeData')
const departmentData = require('../database/departmentData')
const roleData = require('../database/roleData')
const listHelper = require('./listHelper');

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
        choices: () => listHelper.getList('Role', roleData.getRoleList),
    }, {
        name: "managerId",
        message: "Who is the employee's manager?",
        type: "list",
        when: (data) => (data.roleId > 0),
        choices: () => listHelper.getList('Manager', employeeData.getEmployeeList, true, "No Manager"),
    }],

    remove: {
        name: "employeeId",
        message: "Which employee do you want to remove?",
        type: "list",
        choices: () => listHelper.getList('Employee', employeeData.getEmployeeList),
    },

    updateManager: [{
        name: "employeeId",
        message: "Which employee's manager do you want to update?",
        type: "list",
        choices: () => listHelper.getList('Employee', employeeData.getEmployeeList),
    }, {
        name: "managerId",
        message: "Which employee do you want to set as manager for the selected employee?",
        type: "list",
        when: (data) => (data.employeeId > 0),
        choices: async (data) => {
            // Ensure that the selected employee is not listed in the manager list 
            const listData = await listHelper.getList('Manager', employeeData.getEmployeeList, true, "No Manager");
            return listData.filter(element => element.value != data.employeeId);
        },
    }],

    updateRole: [{
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        type: "list",
        choices: () => listHelper.getList('Employee', employeeData.getEmployeeList),
    }, {
        name: "roleId",
        message: "What is the employee's new role?",
        type: "list",
        when: (data) => (data.employeeId > 0),
        choices: () => listHelper.getList('Role', roleData.getRoleList),
    }],

    selectDepartment: {
        name: "departmentId",
        message: "Select a department ...",
        type: "list",
        choices: () => listHelper.getList('Department', departmentData.getDepartmentList),
    },

    selectManager: {
        name: "managerId",
        message: "Select a manager ...",
        type: "list",
        choices: () => listHelper.getList('Manager', employeeData.getManagerList, true, "Not Assigned"),
    },
}

module.exports = employeePrompts;