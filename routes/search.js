var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");
var url = require('url');
var cacheRecepies = null;


/**
 * This path returns a full details of a recipe by its id
 */
router.get("", async (req, res, next) => {
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
      cacheRecepies = recipes;
      req.session.recipes = recipes;
      res.send(recipes);
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;


cacheRecepies = [
  {
    id: 659109,
    title: 'Salmon Quinoa Risotto',
    image: 'https://spoonacular.com/recipeImages/659109-312x231.jpg',
    imageType: 'jpg',
    readyInMinutes: 45,
    vegan: false,
    vegetarian: false,
    favorited: false,
    glutenFree: true,
    instructions: 'In a 4 quart saucepan, heat 2 tablespoons of olive oil over medium high heat.\n' +
      'When oil is shimmering, add diced onion.\n' +
      'Saute onion until transparent.  Add quinoa to onion mixture and stir, to toast quinoa, for 2 minutes.\n' +
      'Add 1 cup of vegetable stock to quinoa and onions.\n' +
      'Stir until stock is absorbed.  Once stock is absorbed, add 1 cup of stock.\n' +
      'Continue stirring until stock is absorbed.\n' +
      'Add remaining stock in 1/2 cup intervals, stirring until all stock is absorbed.\n' +
      'Remove from heat.\n' +
      'While preparing the onion quinoa mixture, heat 1 tablespoon of oil in a saute pan with chopped garlic (over medium high heat).\n' +        
      'Once garlic is sizzling, add chopped kale to the pan.\n' +
      'Turn kale to coat with oil and garlic.\n' +
      'Turn kale mixture until fragrant (approximately 2 minutes).  Remove kale mixture from heat.\n' +
      'Once quinoa is complete, add kale and salmon.\n' +
      'Stir to combine.\n' +
      'Add salt and pepper to taste.'
  },
  {
    id: 659037,
    title: 'Salmon and Broccoli Crepes',
    image: 'https://spoonacular.com/recipeImages/659037-312x231.jpg',
    imageType: 'jpg',
    readyInMinutes: 45,
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    favorited: false,
    instructions: '<ol><li>Combine milk, water, egg and melted butter in a small bowl. Add flour and salt and whip until well blended. Allow to sit for 10 minutes.</li><li>Steam broccoli until just tender, and combine salmon, shallot, thyme, lemon juice, dijon and 1/2 cup sour cream. Chop pieces of salmon and broccoli with a spoon if you have extra large pieces. Warm salmon mixture in the microwave for 2 minutes.</li><li>Combine remaining sour cream and lemon zest.</li><li>Heat a medium non-stick skillet over medium heat and spray with cooking spray. Add 1/4 cup crepe batter to the pan and swirl around to create an even pancake. Cook 1  2 minutes on the first side to brown crepe, then flip and brown the other side. Crepes cook quickly because they are so thin. Remove to a plate and keep warm.</li><li>Fill a crepe with 1/4 salmon lengthwise and gently roll. Slice in half on a diagonal and top with a tablespoon of sour cream and lemon zest mixture.</li></ol>'
  },
  {
    id: 660366,
    title: 'Smoked Salmon and Mascarpone Calzone',
    image: 'https://spoonacular.com/recipeImages/660366-312x231.jpg',
    imageType: 'jpg',
    readyInMinutes: 45,
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    favorited: false,
    instructions: '<ol><li>Preheat your oven to 450F and place the top rack in the lower third of your oven.  Like a baking sheet with parchment paper (optional, for easier cleanup).</li><li>Wash and pat dry the leek.  Slice the leek lengthwise, then cut each half into long, very thin strips.  Cut the strips into short pieces, about  long.  Set aside.</li><li>Divide the dough into two equal parts, and roll out each into a 10 circle.  Gently spread a thin layer of mascarpone on the surface of the dough, leaving at least a  crust.</li><li>In a small bowl, break up the smoked salmon using your fingers until it is fluffy.  You want the filling of the calzone to be pretty even, or it will fall apart as you eat it.</li><li>Divide the salmon between the two crusts, arranging it only on one side of the crust (in a half-moon shape), again leave at least a  crust.  Sprinkle the chives and leeks over the salmon, then lightly salt and pepper.  Finally, drizzle with about 1 tsp of olive oil.</li><li>Fold each calzone in half, making sure that the crusts line up.  Using the tines of a fork, gently press down the edge all the way around the rounded side of the calzone to seal it.  Make sure you get a tight seal  this will help the calzone puff up during baking.</li><li>Brush the tops of each calzone with egg white.  Bake at 450F for about 15 minutes, or until golden brown and delicious.</li></ol>'
  },
  {
    id: 1095806,
    title: 'Spanish style salmon fillets',
    image: 'https://spoonacular.com/recipeImages/1095806-312x231.jpg',
    imageType: 'jpg',
    readyInMinutes: 30,
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    favorited: false,
    instructions: '<ol><li>Cut onions into wedges and slice bell peppers into strips.</li><li>Put the croutons, olives, onions, and peppers on a baking sheet. </li><li> Add the smoked paprika, salt, pepper and 3 tablespoons of the olive oil and toss until everything is evenly coated. Bake in the oven at 400F for about 15 minutes.</li><li>Rub the salmon fillets with the remaining 2 tablespoons olive oil and season with the remaining salt and pepper. </li><li>Arrange the fillets among the vegetables and croutons on the baking sheet. Bake for 10-15 minutes or until the salmon is cooked.</li></ol>'
  },
  {
    id: 632046,
    title: 'Alaskan Smoked Salmon Nicoise Salad With Alouette Crumbled Feta',
    image: 'https://spoonacular.com/recipeImages/632046-312x231.jpg',
    imageType: 'jpg',
    readyInMinutes: 45,
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    instructions: '<ol><li>Prepare the dressing with the olive oil, chopped basil, garlic, salt, pepper and vinegar, Refrigerate.</li><li>Quarter the tomatoes.  Thinly slice the eggs.  Halve the cucumber and cut it into thin slices.  Slice the onion into thing rings</li><li>Instead of mixing the ingredients together, which you can do, I like to arrange them on a salad place for clor and appearance.  Sprinkle the cheese on top, drizzle with the dressing and serve.</li></ol>',
    favorited: false
  }
]