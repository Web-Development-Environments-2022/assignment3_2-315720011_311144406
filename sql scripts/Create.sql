DROP TABLE If EXISTS users ;

CREATE TABLE users (
    PRIMARY KEY username VARCHAR(8),
    password VARCHAR(255),
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    country VARCHAR(30),
    email VARCHAR(30)
);