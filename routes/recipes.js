var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

router.get("/random", async (req, res, next) => {
  try {

      let three_recipes = await recipes_utils.getRandomThreeRecipes();
      let recipes_ids = [];
      if(req.session && req.session.user_id) {
        recipes_ids = await user_utils.getFavoriteRecipesIds(req.session.user_id);
      }
      three_recipes.map(recipe => {
        if(recipes_ids.includes(recipe.id)){
          recipe.favorited = true;
        }
        else{
          recipe.favorited = false;
        }
      });
      res.send(three_recipes);

  } catch (error) {
    next(error);
  }
});

router.get("/information/:recipeId", async (req, res, next) => {
  try {
    let recipe = await recipes_utils.getFullRecipeDetails(req.params.recipeId);
    let recipes_ids = [];
    if(req.session && req.session.user_id) {
      recipes_ids = await user_utils.getFavoriteRecipesIds(req.session.user_id);
    }
    if(recipes_ids.includes(recipe.id)){
      recipe.favorited = true;
    }
    else{
      recipe.favorited = false;
    }

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
