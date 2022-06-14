var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});
router.get('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let myrecipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


router.post("/createrecipe", async (req, res, next) => {
  try {
    let recipe_details = {
      user_id: req.session.user_id,
      title: req.body.title,
      readyInMinutes: parseInt(req.body.readyInMinutes),
      image: req.body.image,
      popularity: 0,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      gluten_free: req.body.gluten_free,
      instructions: req.body.instructions,
      servings: parseInt(req.body.servings),
      ingredientsNameAmount: req.body.ingredientsNameAmount,
    }

    await user_utils.createRecipe(recipe_details);
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    if(error == 409){
      res.status(409).send({ message: "recipe title already exists for user", success: false });
    }
    else{
      next(error);
    }
  }
});




module.exports = router;
