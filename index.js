const inquirer = require("inquirer");
const figlet = require('figlet');
const boxen = require('boxen');
require('console.table');
const database = require('./lib/database/database')
const employeeTracker = require('./lib/employeeTracker');
const employee = require('./lib/employee');
const role = require('./lib/role');
const department = require('./lib/department');

/** figlet options for the application banner */
const figletOptions = {
    horizontalLayout: 'full',
    verticalLayout: 'fitted'
};

/** boxen options for the application banner */
const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'classic'
};

/** Displays the Employee Tracker banner */
function displayBanner() {
    let banner = figlet.textSync('Employee \n\n Tracker', figletOptions);
    console.info(boxen(banner, boxenOptions));
}

/** Method prompts user to select actions and executes each action selected */
async function performUserActions() {
    try {
        let exitApplication = false;
        while (!exitApplication) {
            let selectedAction = await inquirer.prompt(employeeTracker.actionPrompts);
            if (selectedAction.actionType == employeeTracker.ActionTypes.Quit)
                exitApplication = true;
            else {
                let result = await executeAction(selectedAction);
                displayResult(result);
            }
        }
    }
    catch (error) {
        throw error;
    }
}

/**
 * This function executes an action chosen by the user
 * @param {Object} userAction object containing the user's choices
 * @param {Number} userAction.actionType the action type selected by the user 
 * @returns {Object} results of executing the action
 */
async function executeAction({ actionType }) {
    try {
        switch (actionType) {
            case employeeTracker.ActionTypes.AllEmployees:
                return await employee.listAll();
                break;
            case employeeTracker.ActionTypes.EmployeesByDepartment:
                return await employee.listByDepartment();
                break;
            case employeeTracker.ActionTypes.EmployeesByManager:
                return await employee.listByManager();
                break;
            case employeeTracker.ActionTypes.AddEmployee:
                return await employee.add();
                break;
            case employeeTracker.ActionTypes.RemoveEmployee:
                return await employee.remove();
                break;
            case employeeTracker.ActionTypes.UpdateRole:
                return await employee.updateRole();
                break;
            case employeeTracker.ActionTypes.UpdateManager:
                return await employee.updateManager();
                break;
            case employeeTracker.ActionTypes.AllRoles:
                return await role.listAll();
                break;
            case employeeTracker.ActionTypes.AddRole:
                return await role.add();
                break;
            case employeeTracker.ActionTypes.RemoveRole:
                return await role.remove();
                break;
            case employeeTracker.ActionTypes.AllDepartments:
                return await department.listAll();
                break;
            case employeeTracker.ActionTypes.AddDepartment:
                return await department.add();
                break;
            case employeeTracker.ActionTypes.RemoveDepartment:
                return await department.remove();
                break;
            case employeeTracker.ActionTypes.TotalUtilizedBudget:
                return await department.getTotalUtilizedBudget();
            default:
                return null;
        }
    }
    catch (error) {
        console.log(`\n\n Error: ${error.message} \n\n`);
    }
}

/**
 * The method renders the results of an action to the user
 * @param {Object} result the action result to be displayed
 */
function displayResult(result) {
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
}

/** This method initializes and executes the application */
async function initialize() {
    try {
        displayBanner();
        await database.openConnection();
        await performUserActions();
    }
    catch (error) {
        console.log("\n\nEmployee Tracker - Operation failed!\n");
        console.error(error.stack);
    }
    finally {
        await database.closeConnection();
    }
}

// start application execution
initialize();