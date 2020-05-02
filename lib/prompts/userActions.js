
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

// Object contains inquirer prompts that help the user choose the next action
const actionPrompts = {
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
};

module.exports = { ActionTypes, actionPrompts }