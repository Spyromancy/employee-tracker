const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = mysql.createPool(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'M4r4th15BAE',
        database: 'employee_db',
    },
);

const promiseDB = db.promise();

function businessInfo() {
    return inquirer.prompt([
        // Select method
        {
            type:'list',
            name:'function',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Department', 'Add Department', 'Quit']
        },
    ])
        .then(choice => {
            switch(choice.function) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Department':
                    viewDepartment();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    return;
            }
        });
}
// view departments {show table}
function viewDepartment() {
    const sql = 'select * from department';
    db.query(sql, (err,rows) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.table(rows);
        return businessInfo();
    })
}
// view roles {show table}
function viewRoles() {
    const sql = 'select * from role';
    db.query(sql, (err,rows) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.table(rows);
        return businessInfo();
    })
}
// view employees {show table}
function viewEmployees() {
    const sql = 'select * from employee';
    db.query(sql, (err,rows) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.table(rows);
        return businessInfo();
    })
}
// add dept {INSERT INTO departments}
function addDepartment() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'Enter the name of the department.',
            validate: textInput => {
                if (textInput){
                    return true;
                } else {
                    console.log("Please enter a name for the department!");
                    return false;
                }
            }
        }
    ])
    .then( deptInfo => {
        const sql = `INSERT INTO department (name) values (?)`;
        const params = [deptInfo.dept];
        db.query(sql, params, (err, result) => {
            if(err){
                console.log(err.message);
                return;
            }
            console.log(`Added ${params[0]} to the database!`);
            return businessInfo();
        })
    })
}
// add a role {INSERT INTO role}
async function addRole() {
    const deptSQL = `SELECT name FROM department`;
    const [deptArr, fields] = await promiseDB.query({sql: deptSQL, rowsAsArray:true});
    console.log(deptArr);

    /*return inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Enter the name of the role.',
            validate: textInput => {
                if (textInput){
                    return true;
                } else {
                    console.log("Please enter a name for the role!");
                    return false;
                }
            }
        },
        
    ])
    .then( roleInfo => {
        const sql = `INSERT INTO role (name) values (?)`;
        const params = [roleInfo.role];
        db.query(sql, params, (err, result) => {
            if(err){
                console.log(err.message);
                return;
            }
            console.log(`Added ${params[0]} to the database!`);
            return businessInfo();
        })
    })*/
}
// add an employee {INSERT INTO employee}
function addEmployee() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'Enter the name of the department.',
            validate: textInput => {
                if (textInput){
                    return true;
                } else {
                    console.log("Please enter a name for the department!");
                    return false;
                }
            }
        }
    ])
    .then( deptInfo => {
        const sql = `INSERT INTO department (name) values (?)`;
        const params = [deptInfo.dept];
        db.query(sql, params, (err, result) => {
            if(err){
                console.log(err.message);
                return;
            }
            console.log(`Added ${params[0]} to the database!`);
            return businessInfo();
        })
    })
}
// update employee role {INSERT INTO departments}


// Turn array of arrays into an array
function simplifyArray(arr){
    let result = [];
    for (const dept of arr){
        result = result.concat(dept);
    }
    return result;
}



//businessInfo();
addRole();