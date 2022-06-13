DROP TABLE If EXISTS users;

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(8) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL
);

DROP TABLE If EXISTS FavoriteRecipes;

CREATE TABLE FavoriteRecipes (
    user_id INT NOT NULL REFERENCES users(user_id),
    recipe_id INT NOT NULL,
    CONSTRAINT favorite PRIMARY KEY(user_id, recipe_id)
);