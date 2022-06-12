var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
var url = require('url');


/**
 * This path returns a full details of a recipe by its id
 */
router.get("", async (req, res, next) => {
  try {

    var url_parts = url.parse(req.url, true);
    var params = url_parts.query;

    const query = params.query || "";
    if(query === "")
        throw { status: 400, message: "Invalid Arguments" };
        
    const number = parseInt(params.number) || 5;
    if(number != 5 && number != 10 && numer != 15)
        throw { status: 400, message: "Invalid Arguments" };

    const recipes = await recipes_utils.searchRecipe(query, number);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;