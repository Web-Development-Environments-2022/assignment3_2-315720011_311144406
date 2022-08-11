var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

var cacheRecepie = null;

var cacheRecepies = [
  {
    id: 634605,
    title: 'Beef Cottage Pie',
    readyInMinutes: 45,
    image: 'https://spoonacular.com/recipeImages/634605-556x370.jpg',
    popularity: 6,
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    favorited: false
  },
  {
    id: 660227,
    title: 'Skinny Green Monster Smoothie',
    readyInMinutes: 45,
    image: 'https://spoonacular.com/recipeImages/660227-556x370.jpg',
    popularity: 7,
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    favorited: false
  },
  {
    id: 658725,
    title: 'Rocky Road Ice Cream',
    readyInMinutes: 45,
    image: 'https://spoonacular.com/recipeImages/658725-556x370.jpg',
    popularity: 23,
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    favorited: false
  }
]

router.get("/", (req, res) => res.send("im here in recipes")); //remove

router.get("/random", async (req, res, next) => {
  try {
    if(cacheRecepies != null){
      let recipes_ids = [];
      if(req.session && req.session.user_id) {
        recipes_ids = await user_utils.getFavoriteRecipesIds(req.session.user_id);
      }
      cacheRecepies.map(recipe => {
        if(recipes_ids.includes(recipe.id)){
          recipe.favorited = true;
        }
        else{
          recipe.favorited = false;
        }
      });
      console.log(cacheRecepies);
      res.send(cacheRecepies);
    }
    
    else{
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
      cacheRecepies = three_recipes;
      console.log(cacheRecepies);
      res.send(three_recipes);
    }
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/information/:recipeId", async (req, res, next) => {
  try {
    if(cacheRecepie != null){
      console.log(cacheRecepie);
      res.send(cacheRecepie);
    }
    else{
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
      cacheRecepie = recipe;
      console.log(cacheRecepie);
      res.send(recipe);
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
