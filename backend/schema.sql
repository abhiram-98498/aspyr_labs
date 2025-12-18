CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    ssn VARCHAR(20),
    gender VARCHAR(10),
    age INT
);

INSERT INTO clients (first_name, last_name, phone, ssn, gender, age) VALUES
('Ayaan','Khan','900001','111','Male',5),
('Arjun','Patel','900002','112','Male',8),
('Rohit','Sharma','900003','113','Male',18),
('John','Doe','900004','114','Male',25),
('Alex','Brown','900005','115','Male',34),
('Chris','Anderson','900006','116','Male',52),
('Bob','Miller','900007','117','Male',67),
('Anaya','Singh','900008','201','Female',6),
('Myra','Verma','900009','202','Female',9),
('Riya','Patel','900010','203','Female',21),
('Pooja','Mehta','900011','204','Female',28),
('Anna','Taylor','900012','205','Female',35),
('Rachel','Thomas','900013','206','Female',46),
('Mary','Lewis','900014','207','Female',63);
