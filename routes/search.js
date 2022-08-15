var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");
var url = require('url');

router.get("", async (req, res, next) => {
  try {

      var url_parts = url.parse(req.url, true);
      var params = url_parts.query;
  
      const query = params.query || "";
      if(query === "")
          throw { status: 400, message: "Invalid Arguments" };
          
      const number = parseInt(params.number) || 5;
      if(number != 5 && number != 10 && number != 15)
          throw { status: 400, message: "Invalid Arguments" };
  
      const cuisine = params.cuisine || '';
  
      const diet = params.diet || '';
  
      const intolerances = params.intolerances || '';
  
      const recipes = await recipes_utils.searchRecipe(query, number, cuisine, diet ,intolerances);
      //set favorited
      let recipes_ids = [];
      if(req.session && req.session.user_id) {
        recipes_ids = await user_utils.getFavoriteRecipesIds(req.session.user_id);
      }
      recipes.map(recipe => {
        if(recipes_ids.includes(recipe.id)){
          recipe.favorited = true;
        }
        else{
          recipe.favorited = false;
        }
      });
      
      //set coookies
      req.session.recipes = recipes;
      res.send(recipes);
    // }

  } catch (error) {
    next(error);
  }
});

module.exports = router;