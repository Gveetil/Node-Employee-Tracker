const departmentData = require('../database/departmentData')
const listHelper = require('./listHelper');

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
        choices: () => listHelper.getList('Department', departmentData.getDepartmentList),
    },

    totalUtilizedBudget: {
        name: "departmentId",
        message: "Which department do you want to view the total utilized budget of?",
        type: "list",
        choices: async () => listHelper.getList('Department', departmentData.getDepartmentList, true, "Select All Departments")
    },
};

module.exports = departmentPrompts;