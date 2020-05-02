/**
 * This method fetches a list of options to be displayed to the user in inquirer
 * It fetches the list from the database using the given callback function 
 * @param {string} listType the type of list being shown
 * @param {function} listFunction the callback function used to fetch list data  
 * @param {boolean} allowNull true if the list allows a null selection
 * @param {string} nullValueText the text to be displayed for the null option
 * @returns {Array<object>} array of name / value objects
 */
async function getList(listType, listFunction, allowNull = false, nullValueText = "") {
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
};

module.exports = { getList };