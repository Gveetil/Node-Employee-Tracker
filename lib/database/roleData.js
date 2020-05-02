const database = require('./database')

/** This module contains functions to perform CRUD operations on the Role table */
const Role = {
    /** Fetch all data from the Role table */
    fetchAllRoles: async () => {
        return database.query(`
        SELECT 
            r.id, r.title, r.salary, d.name department
        FROM role r
        INNER JOIN department d
            ON r.department_id = d.id
        ORDER BY r.title`);
    },

    /** Add a new Role and return success / error message */
    addRole: async ({ title, salary, departmentId }) => {
        if (departmentId <= 0)
            throw new Error("Error adding role: Invalid department");

        let result = await database.query(`
            INSERT INTO role (title, salary, department_id)
            VALUES (? , ?, ?)`, [title, salary, departmentId]);

        if (result.affectedRows != 1) {
            throw new Error(`Error adding role: ${title} to the database.`);
        }
        return `Added ${title} to the database!`;
    },

    /** Remove the given Role and return success / error message */
    removeRole: async ({ roleId }) => {
        if (roleId <= 0)
            throw new Error("Error removing role: Invalid Id");

        // Check if role is in use
        const canRemove = await Role.canRemoveRole(roleId);
        if (!canRemove)
            return `This role is in use and cannot be removed!`;

        let result = await database.query(
            `DELETE FROM role WHERE id = ? `,
            roleId);

        if (result.affectedRows != 1) {
            throw new Error(`Could not delete role: ${roleId} from the database.`);
        }
        return `Removed role from the database!`;
    },

    /** Checks if the given Role has dependancies */
    canRemoveRole: async (roleId) => {
        let result = await database.query(
            `SELECT id FROM employee WHERE role_id = ? `,
            roleId);
        return (result.length == 0);
    },

    /** Returns a name - value list of all roles */
    getRoleList: async () => {
        return database.query(
            "SELECT id value, title name FROM role ORDER BY title");
    },
};

module.exports = Role;