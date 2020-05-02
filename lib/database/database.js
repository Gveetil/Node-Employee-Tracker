const mysql = require("mysql");
const util = require('util');
require('dotenv').config();

/** This object represents the current database configuration */
const config = {
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

/** This class represents a connection to the employee database */
class Database {

    /** Opens a connection to the database */
    async openConnection() {
        try {
            if (!this.isConnected()) {
                // save connection and promisified query in static variables for later use
                Database.connection = mysql.createConnection(config);
                Database.query = util.promisify(Database.connection.query);
                await util.promisify(Database.connection.connect).call(Database.connection);
            }
        }
        catch (error) { throw error; }
    }

    /**
     * Execute a database query asynchronously and returns a Promise 
     * @param {string} sql the query to execute
     * @param {any} args the query arguments 
     * @returns {Promise} returns a Promise 
     */
    async query(sql, args) {
        try {
            if (!this.isConnected())
                throw new Error("Please connect to the database before executing a query!");
            return Database.query.call(Database.connection, sql, args);
        }
        catch (error) { throw error; }
    }

    /**
     * Check if the database connection is valid
     * @returns {boolean} returns true if connected, else false
     */
    isConnected() {
        if (Database.connection != null && Database.connection.state == "authenticated")
            return true;
        return false;
    }

    /** Close connection to the database */
    async closeConnection() {
        try {
            if (this.isConnected()) {
                // release connection and clear static variables
                await util.promisify(Database.connection.end).call(Database.connection);
                Database.connection = null;
                Database.query = null;
            }
        }
        catch (error) { throw error; }
    }
};

module.exports = new Database();