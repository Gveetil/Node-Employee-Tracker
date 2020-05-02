const database = require('./database')

/** This module contains functions to perform CRUD operations on the Department table */
const Department = {
    /** Fetch all data from the Department table */
    fetchAllDepartments: async () => {
        return database.query(`
        SELECT d.id, d.name
        FROM department d 
        ORDER BY d.name`);
    },

    /** Add a new Department and return success / error message */
    addDepartment: async ({ name }) => {
        let result = await database.query(`
            INSERT INTO department (name)
            VALUES (?)`,
            [name]);

        if (result.affectedRows != 1) {
            throw new Error(`Error adding department: ${name} to the database.`);
        }
        return `Added ${name} to the database!`;
    },

    /** Remove the given Department and return success / error message */
    removeDepartment: async ({ departmentId }) => {
        if (departmentId <= 0)
            throw new Error("Error removing department: Invalid Id");

        // Check if department is in use
        const canRemove = await Department.canRemoveDepartment(departmentId);
        if (!canRemove)
            return `This department is in use and cannot be removed!`;

        let result = await database.query(
            `DELETE FROM department WHERE id = ? `,
            departmentId);

        if (result.affectedRows != 1) {
            throw new Error(`Could not delete department: ${departmentId} from the database.`);
        }
        return `Removed department from the database!`;
    },

    /** Checks if the given Department has dependancies */
    canRemoveDepartment: async (departmentId) => {
        let result = await database.query(
            `SELECT id FROM role WHERE department_id = ? `,
            departmentId);
        return (result.length == 0);
    },

    /** Returns a name - value list of all departments */
    getDepartmentList: async () => {
        return database.query(
            "SELECT id value, name FROM department ORDER BY name");
    },

    /** Returns the total utilized budget for a given department 
     * or all departments when 0 is passed in */
    getTotalUtilizedBudget: async ({ departmentId }) => {
        let filterDepartment = " "
        if (parseInt(departmentId) > 0)
            filterDepartment = " HAVING d.id = ? "

        return database.query(`
        SELECT d.id,
              d.name department,
              IFNULL(sum(r.salary),0) "total utilized budget"
        FROM employee e
        INNER JOIN role r
            ON r.id = e.role_id 
        RIGHT JOIN department d
            ON d.id = r.department_id 
        GROUP BY d.id
            ${filterDepartment}
        ORDER BY d.name`,
            departmentId);
    },
}

module.exports = Department;