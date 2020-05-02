USE employee_db;

/* Load departments */
INSERT INTO department (id, name) VALUES 
    (1, "Sales"), 
    (2, "Engineering"), 
    (3, "Finance"), 
    (4, "Legal");


/* Load roles */
INSERT INTO role (id, title, salary, department_id) VALUES 
    (1, "Sales Lead", 100000, 1),
    (2, "Salesperson", 80000, 1),
    (3, "Lead Engineer", 150000, 2),
    (4, "Software Engineer", 120000, 2),
    (5, "Accountant", 125000, 3),
    (6, "Legal Team Lead", 250000, 4),
    (7, "Lawyer", 190000, 4);


/* Load employees */
INSERT INTO employee (id, first_name, last_name,role_id, manager_id) VALUES 
    (1, "Ashley", "Rodriguez", 3, NULL),
    (2, "Malia", "Brown", 5, NULL),
    (3, "Sarah", "Lourd", 6, NULL),
    (4, "John", "Doe", 1, 1),
    (5, "Mike", "Chan", 2, 4),
    (6, "Kevin", "Tupik", 4, 1),
    (7, "Tom", "Allen", 7, 3);
