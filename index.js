const figlet = require('figlet');
const boxen = require('boxen');
require('console.table');

const database = require('./lib/database/database')
const employeeTracker = require('./lib/employeeTracker');

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

/** This method initializes and executes the application */
async function initialize() {
    try {
        displayBanner();
        await database.openConnection();
        await employeeTracker.executeUserActions();
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