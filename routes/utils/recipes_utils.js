const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipePreview(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }
}


async function getRecipesPreview(recipes_id_array){
    let res = [];
    recipes_id_array.map(ecipe_id => res.push(getRecipePreview(ecipe_id)));
    return await Promise.all(res);
}

async function getRecipeAnalyzedInstructions(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getFullRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,
         extendedIngredients, instructions, servings} = recipe_info.data;

    let analyzedInstructionsData = await getRecipeAnalyzedInstructions(recipe_id);
    let analyzedInstructions = analyzedInstructionsData.data[0];
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        analyzedInstructions: analyzedInstructions,
        instructions: instructions,
        servings: servings,
    }
}

async function searchRecipe(query, number, cuisine, diet ,intolerances) {
    params = { 
        query: query,
        number: number,
        apiKey: process.env.spooncular_apiKey,
        instructionsRequired: true
    }
    if (cuisine != "")
        params.cuisine = cuisine;
    if (diet != "")
        params.diet = diet;
    if (intolerances != "")
        params.intolerances = intolerances;
    let receipes = await axios.get(`${api_domain}/complexSearch`, {params});
    results = receipes.data.results;
    for (const receipe of results) {
        let recipe_info = await getRecipeInformation(receipe.id);
        receipe.readyInMinutes = recipe_info.data.readyInMinutes;
        receipe.readyInMinutes = recipe_info.data.readyInMinutes;
        receipe.vegan = recipe_info.data.vegan;
        receipe.vegetarian = recipe_info.data.vegetarian;
        receipe.glutenFree = recipe_info.data.glutenFree;
        receipe.instructions = recipe_info.data.instructions;
    }
    return results;

}
async function getRandomRecipes() {
    const response = await axios.get(`${api_domain}/random`,{
        params: {
            number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    
    });
    return response;
}
async function getRandomThreeRecipes(){
    let ten_random= await getRandomRecipes();
    let filter_three = ten_random.data.recipes.filter((random)=>(random.instructions != "" && random.image));
   
    
    if(filter_three.length < 3){
        return getRandomThreeRecipes();
     }
    let id_list = [filter_three[0].id,filter_three[1].id,filter_three[2].id];
    return getRecipesPreview(id_list);
}


exports.getFullRecipeDetails = getFullRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.searchRecipe = searchRecipe;
exports.getRandomThreeRecipes = getRandomThreeRecipes;


