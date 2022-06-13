var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here in recipes"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/threerandom", async (req, res, next) => {
  try {
    const three_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(three_recipes);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
