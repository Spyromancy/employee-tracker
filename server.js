const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'M4r4th15BAE',
        database: 'employee_db',
    },
);

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
async function viewRoles() {
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
async function viewEmployees() {
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
    return inquirer.prompt([
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
    })
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

businessInfo();