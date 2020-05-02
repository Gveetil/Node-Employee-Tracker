const inquirer = require("inquirer");

/** 
 * Enumeration of User Action Types
 * @enum {Number}
*/
const ActionTypes = {
    AllEmployees: 1,
    EmployeesByDepartment: 2,
    EmployeesByManager: 3,
    AddEmployee: 4,
    RemoveEmployee: 5,
    UpdateRole: 6,
    UpdateManager: 7,
    AllRoles: 8,
    AddRole: 9,
    RemoveRole: 10,
    AllDepartments: 11,
    AddDepartment: 12,
    RemoveDepartment: 13,
    TotalUtilizedBudget: 14,
    Quit: 15
};

/** This module provides common methods and properties that are
 * used across the employee tracker modules  */
const EmployeeTracker = {
    // The Action Types Enum
    ActionTypes,

    // Object contains inquirer prompts that help the user choose the next action
    actionPrompts: {
        name: "actionType",
        message: "What would you like to do?",
        type: "list",
        choices: [
            { name: "Employee -> View All", value: ActionTypes.AllEmployees },
            { name: "Employee -> View By Department", value: ActionTypes.EmployeesByDepartment },
            { name: "Employee -> View By Manager", value: ActionTypes.EmployeesByManager },
            { name: "Employee -> Add", value: ActionTypes.AddEmployee },
            { name: "Employee -> Remove", value: ActionTypes.RemoveEmployee },
            { name: "Employee -> Update Role", value: ActionTypes.UpdateRole },
            { name: "Employee -> Update Manager", value: ActionTypes.UpdateManager },
            { name: "Role -> View All", value: ActionTypes.AllRoles },
            { name: "Role -> Add", value: ActionTypes.AddRole },
            { name: "Role -> Remove", value: ActionTypes.RemoveRole },
            { name: "Department -> View All", value: ActionTypes.AllDepartments },
            { name: "Department -> Add", value: ActionTypes.AddDepartment },
            { name: "Department -> Remove", value: ActionTypes.RemoveDepartment },
            { name: "Department -> View Total Utilized Budget", value: ActionTypes.TotalUtilizedBudget },
            { name: ">> Exit Application >>", value: ActionTypes.Quit }
        ]
    },

    /**
     * This method fetches a list of options to be displayed to the user in inquirer
     * It fetches the list from the database using the given callback function 
     * @param {string} listType the type of list being shown
     * @param {function} listFunction the callback function used to fetch list data  
     * @param {boolean} allowNull true if the list allows a null selection
     * @param {string} nullValueText the text to be displayed for the null option
     * @returns {Array<object>} array of name / value objects
     */
    getList: async (listType, listFunction, allowNull = false, nullValueText = "") => {
        try {
            // Call function to get data from database as name value pairs 
            let data = await listFunction();
            let listData = [];
            if (data != null && data.length > 0) {
                listData = data;
            }

            // If Data allows null - add the null entry with a value of 0
            if (allowNull) {
                listData.push({ name: `( ${nullValueText} )`, value: 0 });
            }

            if (listData.length > 0)
                return listData;

            // No data found and null values are not allowed - return error message
            return [{ name: `<No ${listType}s available! Please add ${listType} before proceeding>`, value: -1 }];
        } catch (error) {
            // Display error messages to user
            return [{ name: `<Error:${error.message}>`, value: -1 }];
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
}

module.exports = EmployeeTracker;