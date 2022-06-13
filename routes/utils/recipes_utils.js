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



async function getRecipeDetails(recipe_id) {
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
    for (const recipe_id of recipes_id_array) {
        let recipe_info = await getRecipeDetails(recipe_id);

    }
}

async function searchRecipe(query, number, cuisine, diet ,intolerances) {
    params = { 
        query: query,
        number: number,
        apiKey: process.env.spooncular_apiKey
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



exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;


