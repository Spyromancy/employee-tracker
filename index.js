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

async function businessInfo() {
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
async function viewDepartment() {
    const sql = 'select * from department';
    const [rows, fields] = await promiseDB.query(sql)
    console.table(rows);
    return businessInfo();
}
// view roles {show table}
async function viewRoles() {
    const sql = 'select * from role';
    const [rows, fields] = await promiseDB.query(sql)
    console.table(rows);
    return businessInfo();
}
// view employees {show table}
async function viewEmployees() {
    const sql = 'select * from employee';
    const [rows, fields] = await promiseDB.query(sql)
    console.table(rows);
    return businessInfo();
}
// add dept {INSERT INTO departments}
async function addDepartment() {
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
    .then(async deptInfo => {
        const sql = `INSERT INTO department (name) values (?)`;
        const params = [deptInfo.dept];
        await promiseDB.query(sql, params);
        console.log(`Added ${params[0]} to the database!`);
        return businessInfo();
    })
}
// add a role {INSERT INTO role}
async function addRole() {
    const deptSQL = `SELECT name FROM department`;
    const [rows, fields] = await promiseDB.query({sql: deptSQL, rowsAsArray:true});
    const deptArr = simplifyArray(rows);
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role.',
            validate: textInput => {
                if (textInput){
                    return true;
                } else {
                    console.log("Please enter a title for the role!");
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: input => {
                if (input){
                    return true;
                } else {
                    console.log("  Please enter number!");
                    return false;
                }
            }
        },
        {
            type:'list',
            name:'department',
            message: 'What department does the role belong to?',
            choices: deptArr,
            // convert the dept name to it's matching id, since it already appears in the order it is in
            // in the database we don't need to do a seperate call to it.
            filter: input => {
                return (deptArr.indexOf(input)+1);
            }
        },
        
    ])
    .then( async roleInfo => {
        const sql = `INSERT INTO role (title, salary, department_id) values (?,?,?)`;
        const params = [roleInfo.title, roleInfo.salary, roleInfo.department];
        await promiseDB.query(sql, params);
        console.log(`Added ${params[0]} to the database!`);
        return businessInfo();
    });
}
// add an employee {INSERT INTO employee}
async function addEmployee() {
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



businessInfo();
