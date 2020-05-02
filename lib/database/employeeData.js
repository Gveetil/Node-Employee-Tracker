const database = require('./database');

/** Sql query to fetch all employee details */
const allEmployeesQuery = ` SELECT 
                                e.id, e.first_name "first name", e.last_name "last name", 
                                r.title, d.name department, r.salary, 
                                IFNULL(CONCAT(m.first_name, " ", m.last_name), "") manager 
                            FROM employee e 
                            INNER JOIN role r
                                ON e.role_id = r.id
                            INNER JOIN department d
                                ON r.department_id = d.id
                            LEFT JOIN employee m
                                ON e.manager_id = m.id`;
const allEmployeesQueryOrderBy = "ORDER BY e.first_name, e.last_name";

/** This module contains functions to perform CRUD operations on the Employee table */
const Employee = {
    /** Fetch all data from the Employee table */
    fetchAllEmployees: async () => {
        return database.query(`${allEmployeesQuery} ${allEmployeesQueryOrderBy}`);
    },

    /** Fetch all data from the Employee table for a given department */
    fetchEmployeesByDepartment: async ({ departmentId }) => {
        return database.query(
            `${allEmployeesQuery} WHERE d.id = ? ${allEmployeesQueryOrderBy}`,
            departmentId);
    },

    /** Fetch all data from the Employee table for a given manager */
    fetchEmployeesByManager: async ({ managerId }) => {
        // Manager Id will be 0 when 'unassigned' is selected
        // so replace all nulls with 0 to fetch unassigned employees
        return database.query(
            `${allEmployeesQuery}  WHERE IFNULL(m.id, 0) = ? ${allEmployeesQueryOrderBy}`,
            managerId);
    },

    /** Add a new Employee and return success / error message */
    addEmployee: async ({ firstName, lastName, roleId, managerId }) => {
        if (roleId <= 0)
            throw new Error("Error adding employee: Invalid Role");

        const employeeManagerId = (managerId <= 0) ? null : managerId;

        let result = await database.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (? , ?, ?, ?)`,
            [firstName, lastName, roleId, employeeManagerId]);

        if (result.affectedRows != 1) {
            throw new Error(`Error adding employee: ${firstName} ${lastName} to the database.`);
        }
        return `Added ${firstName} ${lastName} to the database!`;
    },

    /** Remove the given Employee and return success / error message */
    removeEmployee: async ({ employeeId }) => {
        if (employeeId <= 0)
            throw new Error("Error removing employee: Invalid Id");

        // Check if employee is linked as a manager
        const canRemove = await Employee.canRemoveEmployee(employeeId);
        if (!canRemove)
            return `This employee is currently assigned as a manager and cannot be removed!`;

        let result = await database.query(
            `DELETE FROM employee WHERE id = ? `,
            employeeId);

        if (result.affectedRows != 1) {
            throw new Error(`Could not delete employee: ${employeeId} from the database.`);
        }
        return `Removed employee from the database!`;
    },

    /** Checks if the given Employee has dependancies */
    canRemoveEmployee: async (employeeId) => {
        let result = await database.query(
            `SELECT id FROM employee WHERE manager_id = ? `,
            employeeId);
        return (result.length == 0);
    },

    /** Update an employee's role and return success / error message */
    updateRole: async ({ employeeId, roleId }) => {
        let result = await database.query(
            "UPDATE employee SET ? WHERE ?",
            [{ role_id: roleId }, { id: employeeId }]);

        if (result.affectedRows != 1) {
            throw new Error(`Error updating employee role in the database.`);
        }
        return `Updated employee role in the database!`;
    },

    /** Update an employee's manager and return success / error message */
    updateManager: async ({ employeeId, managerId }) => {
        const updatedManagerId = (managerId <= 0) ? null : managerId;

        let result = await database.query(
            "UPDATE employee SET ? WHERE ?",
            [{ manager_id: updatedManagerId }, { id: employeeId }]);

        if (result.affectedRows != 1) {
            throw new Error(`Error updating employee manager in the database.`);
        }
        return `Updated employee manager in the database!`;
    },

    /** Returns a name - value list of all employees */
    getEmployeeList: async () => {
        return database.query(`
            SELECT e.id value,
                IFNULL(CONCAT(e.first_name, " ", e.last_name), "") name
            FROM employee e
            ORDER BY e.first_name, e.last_name`);
    },

    /** Returns a name - value list of all managers */
    getManagerList: async () => {
        return database.query(`
            SELECT m.id value,
                IFNULL(CONCAT(m.first_name, " ", m.last_name), "") name
            FROM employee e
            INNER JOIN employee m
            ON e.manager_id = m.id
            GROUP BY m.id
            ORDER BY m.first_name, m.last_name`);
    }
}

module.exports = Employee;