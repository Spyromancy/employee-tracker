use employee_db;

drop table if exists department;
drop table if exists role;
drop table if exists employee;

create table department (
    id integer auto_increment primary key not null,
    name varchar(30) not null
);

create table role (
    id integer auto_increment primary key not null,
    title varchar(30) not null,
    salary DECIMAL(10,2) not null,
    department_id integer,
    constraint fk_dept foreign key (department_id) references department(id) on delete set null
);

create table employee (
    id integer auto_increment primary key not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null, 
    role_id integer,
    manager_id integer,
    constraint fk_role foreign key (role_id) references role(id) on delete set null,
    constraint fk_manager foreign key (manager_id) references employee(id) on delete set null
);