var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here in recipes"));

router.get("/random", async (req, res, next) => {
  try {
    let three_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(three_recipes);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/information/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFullRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
