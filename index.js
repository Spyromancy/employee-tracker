const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();
require('console.table');
const db = mysql.createPool(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'View All Department', 'Add Department', 'Quit']
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
                    case 'Update Employee Manager':
                        updateManager();
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
                    return 0;
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
    const sql = `select role.id, role.title, role.salary,
    department.name as department
    from role
    left join department on role.department_id = department.id
    order by role.id`;
    const [rows, fields] = await promiseDB.query(sql)
    console.table(rows);
    return businessInfo();
}
// view employees {show table}
async function viewEmployees() {
    return inquirer.prompt([
        {
            type:'list',
            name: 'view',
            message: 'How would you like to sort the employees?',
            choices: ['id', 'manager', 'department']
        }
    ])
    .then(async answer => {
        switch(answer.view){
            case 'id':
                const idSQL = `select e.id, e.first_name, e.last_name,
                role.title, role.salary, 
                department.name as department, CONCAT(m.first_name, " ", m.last_name) AS manager
                from employee e
                left join role on e.role_id = role.id
                left join department on role.department_id = department.id
                left join employee m on e.manager_id = m.id
                order by e.id`;
                const [idRows, fields1] = await promiseDB.query(idSQL)
                console.table(idRows);
                return businessInfo();
            case 'manager':
                const mgrSQL = `select CONCAT(m.first_name, " ", m.last_name) AS manager,
                e.id, e.first_name, e.last_name,
                role.title, role.salary, 
                department.name as department
                from employee e
                left join role on e.role_id = role.id
                left join department on role.department_id = department.id
                left join employee m on e.manager_id = m.id
                order by e.manager_id`;
                const [mgrRows, fields2] = await promiseDB.query(mgrSQL)
                console.table(mgrRows);
                return businessInfo();
            case 'department':
                const deptSQL = `select department.name as department,
                e.id, e.first_name, e.last_name,
                role.title, role.salary, 
                CONCAT(m.first_name, " ", m.last_name) AS manager
                from employee e
                left join role on e.role_id = role.id
                left join department on role.department_id = department.id
                left join employee m on e.manager_id = m.id
                order by department.id`;
                const [deptRows, fields3] = await promiseDB.query(deptSQL)
                console.table(deptRows);
                return businessInfo();
        }
    })
    
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
    const roleSQL = `SELECT title FROM role`;
    const [rows, fields] = await promiseDB.query({sql: roleSQL, rowsAsArray:true});
    const roleArr = simplifyArray(rows);
    
    const empSQL = `SELECT first_name, last_name FROM employee`;
    const [rows2, fields2] = await promiseDB.query({sql: empSQL, rowsAsArray:true});
    const empArr = simplifyArray(rows2, 'names');
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name",
            validate: textInput => {
                if (textInput){
                    return true;
                } else {
                    console.log("Please enter the employee's name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name",
            validate: textInput => {
                if (textInput){
                    return true;
                } else {
                    console.log("Please enter the employee's last name!");
                    return false;
                }
            }
        },
        {
            type:'list',
            name:'role',
            message: "What is the employee's job title?",
            choices: roleArr,
            // convert the role name to it's matching id, since it already appears in the order it is in
            // in the database we don't need to do a seperate call to it.
            filter: input => {
                return (roleArr.indexOf(input)+1);
            }
        },
        {
            type:'list',
            name:'manager',
            message: "Who is this employee's manager?",
            choices: empArr,
            filter: input => {
                return (empArr.indexOf(input)+1);
            }
        },
        
    ])
    .then( async empInfo => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)`;
        const params = [empInfo.first_name, empInfo.last_name, empInfo.role, empInfo.manager];
        await promiseDB.query(sql, params);
        console.log(`Added ${params[0]} to the database!`);
        return businessInfo();
    }); 
}
// update employee role 
async function updateEmployee() {
    const nameSQL = `select CONCAT(first_name, " ", last_name) as name from employee`
    const [nrows, nfields] = await promiseDB.query({sql:nameSQL, rowsAsArray:true});
    const nameArr = simplifyArray(nrows);

    const roleSQL = `SELECT title FROM role`;
    const [rows, fields] = await promiseDB.query({sql: roleSQL, rowsAsArray:true});
    const roleArr = simplifyArray(rows);

    return inquirer.prompt([
        {
            type:'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: nameArr,
            filter: input => {
                return (nameArr.indexOf(input)+1);
            }
        },
        {
            type:'list',
            name: 'role',
            message: 'What role would you like to give this employee?',
            choices: roleArr,
            filter: input => {
                return (roleArr.indexOf(input)+1);
            }
        }
    ])
    .then (async updateInfo => {
        const sql = `update employee set role_id = ?
                        where id = ?`;
        const params = [updateInfo.role, updateInfo.employee]
        await promiseDB.query(sql, params);
        console.log(`Employee role has been updated!`);
        return businessInfo();
    })


    
}

// update employee's manager 
async function updateManager() {
    const empSQL = `select CONCAT(first_name, " ", last_name) as name from employee`;
    const [eRows, nfields] = await promiseDB.query({sql:empSQL, rowsAsArray:true});
    const empArr = simplifyArray(eRows);

    return inquirer.prompt([
        { // grab the employee to change
            type:'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: empArr,
            filter: input => {
                return (empArr.indexOf(input)+1);
            }
        }
    ])
    .then ( async emp => {
        // remove the employee from the list of managers
        // you can't be your own boss, this is not an MLM Scheme
        const mgrSQL = `select CONCAT(first_name, " ", last_name) as name from employee WHERE employee.id <> ?`;
        const params = [emp.employee];
        const [mRows, nfields] = await promiseDB.query({sql:mgrSQL, rowsAsArray:true}, params); 
        const mgArr = simplifyArray(mRows);
        const manager = await inquirer.prompt([ // gives manager full name
            {
                type:'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: mgArr,
            },
        ])
        getIdSQL = `select id from employee 
        where concat(first_name, " ", last_name) = ?;` // grabs the id that matches the manager's name
        const mgrID = await promiseDB.query({sql:getIdSQL, rowsAsArray:true}, manager.employee);
        return [mgrID[0], emp.employee]; // return in a format that can be fed directly into the query call
    })
    .then (async updateInfo => {
        const sql = `update employee set manager_id = ?
                        where id = ?`;
        await promiseDB.query(sql, updateInfo);
        console.log(`Employee role has been updated!`);
        return businessInfo();
    })


    
}

// Turn array of arrays into an array
function simplifyArray(arr, ...args){
    let result = [];
    for (let row of arr){
        if(args.indexOf('names')!==-1){ // you know what rest parameter? you're alright.
            row= row.join(" ");
        }
        result = result.concat(row);
    }
    
    return result;
}



businessInfo();
