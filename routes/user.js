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
    await user_utils.markFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe was successfully added to favorites");
    } catch(error){
    next(error);
  }
})

/**
 * This path gets body with recipeId and removes this recipe in the favorites list of the logged-in user
 */
 router.post('/favorites/remove', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    console.log(user_id);
    const recipe_id = req.body.recipeId;
    await user_utils.removeFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe was successfully removed from favorites");
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
    const recipes_id = await user_utils.getFavoriteRecipesIds(user_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    results.map((recipe => recipe.favorited = true));
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyRecipes(user_id);

    recipes.map((recipe) => {
      recipe.ingredients = user_utils.getIngredients(recipe.recipe_id);
      recipe.id = recipe.recipe_id;
      recipe.recipe_id = undefined;
    });
    res.status(200).send(recipes);
  } catch(error){
    next(error); 
  }
});


router.post("/createrecipe", async (req, res, next) => {
  try {
    let recipe_details = {
      user_id: req.session.user_id,
      title: req.body.title.replace("'","''"),
      readyInMinutes: parseInt(req.body.readyInMinutes),
      image: req.body.image,
      popularity: 0,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      gluten_free: req.body.gluten_free,
      instructions: req.body.instructions.replace("'","''"),
      servings: parseInt(req.body.servings),
      ingredientsNameAmount: req.body.ingredientsNameAmount,
    }

    if(!recipe_details.image){
      recipe_details.image = ''
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

router.post('/viewed', async (req,res,next) => {
  try{
    const recipes = await recipe_utils.getRecipesPreview(req.session.watched);
    if(req.session && req.session.user_id) {
      recipes_ids = await user_utils.getFavoriteRecipesIds(req.session.user_id);
    }
    three_recipes = recipes.slice(-3);
    three_recipes.map(recipe => {
      if(recipes_ids.includes(recipe.id)){
        recipe.favorited = true;
      }
      else{
        recipe.favorited = false;
      }
    });
    res.status(200).send(three_recipes);
  } catch(error){
    next(error); 
  }
});





module.exports = router;
