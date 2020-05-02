const inquirer = require("inquirer");
const boxen = require('boxen');

const employeePrompts = require('./prompts/employee');
const rolePrompts = require('./prompts/role');
const departmentPrompts = require('./prompts/department');
const userActions = require('./prompts/userActions');

const employeeData = require('./database/employeeData')
const departmentData = require('./database/departmentData')
const roleData = require('./database/roleData')

/** 
 * This module contains the core employee tracker functionality
 * It prompts the user for actions, collects the data required, and executes the actions
 */
const EmployeeTracker = {

    /** Method prompts user to select actions and executes each action selected */
    executeUserActions: async function () {
        try {
            let exitApplication = false;
            while (!exitApplication) {
                // Prompt user action
                let selectedAction = await inquirer.prompt(userActions.actionPrompts);
                if (selectedAction.actionType == userActions.ActionTypes.Quit)
                    exitApplication = true;
                else {
                    // Execute action
                    let result = await this.executeAction(selectedAction);
                    this.displayResult(result);
                }
            }
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * The method renders the results of an action to the user
     * @param {Object} result the action result to be displayed
     */
    displayResult: (result) => {
        if (Array.isArray(result)) {
            // Display as table if result is an Array
            if (result.length > 0) {
                console.log("\n");
                console.table(result);
                console.log("");
            } else {
                console.log(boxen("No Records Found!", { margin: 1 }));
            }
        } else if (typeof (result) == "string") {
            // Display messages in a box
            console.log(boxen(result, { margin: 1 }));
        }
    },

    /** 
     * This method prompts user for inputs and executes the database method using the input recieved
     * @param {Object} dataPrompts object containing inquirer prompts for user input
     * @param {Function} dataMethod the database callback method to be executed
     * @returns {Object} results of database method execution
     */
    execute: async (dataPrompts, dataMethod) => {
        try {
            let data = null;
            if (dataPrompts != null)
                data = await inquirer.prompt(dataPrompts);

            // Call database method with user data
            return await dataMethod(data);
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * This function executes an action chosen by the user
     * @param {Object} userChoices object containing the user's choices
     * @param {Number} userChoices.actionType the action type selected by the user 
     * @returns {Object} results of executing the action
     */
    executeAction: async function ({ actionType }) {
        try {
            switch (actionType) {
                case userActions.ActionTypes.AllEmployees:
                    return await this.execute(null, employeeData.fetchAllEmployees);

                case userActions.ActionTypes.EmployeesByDepartment:
                    return await this.execute(employeePrompts.selectDepartment, employeeData.fetchEmployeesByDepartment);

                case userActions.ActionTypes.EmployeesByManager:
                    return await this.execute(employeePrompts.selectManager, employeeData.fetchEmployeesByManager);

                case userActions.ActionTypes.AddEmployee:
                    return await this.execute(employeePrompts.add, employeeData.addEmployee);

                case userActions.ActionTypes.RemoveEmployee:
                    return await this.execute(employeePrompts.remove, employeeData.removeEmployee);

                case userActions.ActionTypes.UpdateRole:
                    return await this.execute(employeePrompts.updateRole, employeeData.updateRole);

                case userActions.ActionTypes.UpdateManager:
                    return await this.execute(employeePrompts.updateManager, employeeData.updateManager);

                case userActions.ActionTypes.AllRoles:
                    return await this.execute(null, roleData.fetchAllRoles);

                case userActions.ActionTypes.AddRole:
                    return await this.execute(rolePrompts.add, roleData.addRole);

                case userActions.ActionTypes.RemoveRole:
                    return await this.execute(rolePrompts.remove, roleData.removeRole);

                case userActions.ActionTypes.AllDepartments:
                    return await this.execute(null, departmentData.fetchAllDepartments);

                case userActions.ActionTypes.AddDepartment:
                    return await this.execute(departmentPrompts.add, departmentData.addDepartment);

                case userActions.ActionTypes.RemoveDepartment:
                    return await this.execute(departmentPrompts.remove, departmentData.removeDepartment);

                case userActions.ActionTypes.TotalUtilizedBudget:
                    return await this.execute(departmentPrompts.totalUtilizedBudget, departmentData.getTotalUtilizedBudget);

                default:
                    return null;
            }
        }
        catch (error) {
            console.log(`\n\n Error: ${error.message} \n\n`);
        }
    }
}

module.exports = EmployeeTracker;