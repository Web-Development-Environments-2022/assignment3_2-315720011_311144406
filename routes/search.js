var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here in search"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:query", async (req, res, next) => {
  try {
    const number = parseInt(req.params.number) || 5;
    console.log(number);
    const query = req.params.query;
    console.log(query);




    const recipe = await recipes_utils.searchRecipe(query, number);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;