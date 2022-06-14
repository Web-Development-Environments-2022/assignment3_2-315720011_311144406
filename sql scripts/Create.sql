DROP TABLE If EXISTS users;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(8) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL
);

DROP TABLE If EXISTS favoriterecipes;

CREATE TABLE favoriterecipes (
    user_id INT NOT NULL REFERENCES users(user_id),
    recipe_id INT NOT NULL,
    CONSTRAINT favorite PRIMARY KEY(user_id, recipe_id)
);

DROP TABLE If EXISTS recipes;

CREATE TABLE recipes (
    user_id INT NOT NULL REFERENCES users(user_id),
    recipe_id INT AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    ready_in_minutes INT NOT NULL,
    image VARCHAR(100),
    popularity INT NOT NULL,
    vegan VARCHAR(5) NOT NULL,
    vegetarian VARCHAR(5) NOT NULL,
    gluten_free VARCHAR(5) NOT NULL,
    instructions VARCHAR(600) NOT NULL,
    servings INT NOT NULL,
    CONSTRAINT idTitle PRIMARY KEY(recipe_id, title)
);

DROP TABLE If EXISTS ingredients;
CREATE TABLE ingredients (
    recipe_id INT NOT NULL REFERENCES recipes(recipe_id),
    name VARCHAR(30) NOT NULL,
    amount INT NOT NULL,
    CONSTRAINT ingredientOfRecipe PRIMARY KEY(recipe_id, name)
);