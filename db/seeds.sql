insert into department (name)
values
('Sales'), ('Engineering'), ('Legal'), ('Finance');

insert into role (title, salary, department_id)
values
('Sales', 80000, 1), ('Sales Manager', 100000, 1),
('Software Engineer', 120000, 2), ('Head Engineer', 150000, 2),
('Lawyer', 190000, 3), ('Legal Team Lead', 250000, 3),
('Accountant', 125000, 4), ('Account Manager', 160000, 4),
('Unpaid Intern', 0, 1), ('Underpaid Intern', 5000, 1);

insert into employee (first_name, last_name, role_id, manager_id)
values
-- Ladies and gentlemen, the worlds most legally questionable company
('Jordan', 'Belfort', 2, null), -- Sales = 1
('Heinz', 'Doofenshmirtz', 4, null), -- Engineer = 2
('Lionel', 'Hutz', 6, null), -- Legal = 3
('Meyer', 'Lansky', 8, null), -- Accountant = 4
('Office', 'Cat', 10, null),
('Arnold', 'Cunningham', 1, 1),
('Lucius', 'Fox', 3, 2),
('Tony', 'Stark', 3, 2),
('Dell', 'Conagher', 3, 2),
('Matthew', 'Murdock', 5, 3),
('Saul', 'Goodman', 5, 3),
('Harvey', 'Dent', 5, 3),
('Patrick', 'Bateman', 7, 4),
('Michael', 'Morbius', 9, 5);