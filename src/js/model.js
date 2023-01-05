import { BASE_URL, RECIPES_PER_PAGE, LAND_PAGE, KEY } from './config.js';
import { callAJAX } from './helpers.js';
import { async } from 'regenerator-runtime';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: LAND_PAGE,
    recipesPerPage: RECIPES_PER_PAGE,
  },
  bookmarks: [],
};

const enhanceRecipeObjectKeys = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const fetchRecipeData = async function (id) {
  try {
    const url = `${BASE_URL}/${id}?key=${KEY}`;
    const data = await callAJAX(url);
    const { recipe } = data.data;
    state.recipe = enhanceRecipeObjectKeys(recipe);
    // Set true if we found that recipe in the bookmark list, we use [id] to check that, otherwise false;
    state.recipe.bookmark = state.bookmarks.some(
      (bookmark) => bookmark.id === state.recipe.id
    );
  } catch (err) {
    throw err;
  }
};

export const fetchSearchQueryResult = async function (query) {
  try {
    const url = `${BASE_URL}?search=${query}&key=${KEY}`;
    const data = await callAJAX(url);

    state.search.query = query;
    state.search.result = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getRecipesOfPage = function (page) {
  state.search.page = page;
  const start = (page - 1) * state.search.recipesPerPage;
  const end = page * state.search.recipesPerPage;
  return state.search.result.slice(start, end);
};

export const updateRecipeIngredientQuantity = function (servings) {
  state.recipe.ingredients.forEach(
    (ing) => (ing.quantity = (servings * ing.quantity) / state.recipe.servings)
  );
  state.recipe.servings = servings;
};

const saveBookmarksToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const bookmarkARecipe = function (recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmark = true;
  // Update local storage bookmarks after adding a new bookmark
  saveBookmarksToLocalStorage();
};

export const removeRecipeBookmark = function (id) {
  state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);
  state.recipe.bookmark = false;
  // Update local storage bookmarks after removing the bookmark
  saveBookmarksToLocalStorage();
};

const loadBookmarksFromLocalStorage = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (!bookmarks) return;
  state.bookmarks = JSON.parse(bookmarks);
};

const clearBookmarksFromLocalStorage = function () {
  localStorage.removeItem('bookmarks');
};

export const createRecipeObjectForUploading = function (data) {
  const recipe = {
    title: data.title,
    cooking_time: data.cookingTime,
    image_url: data.image,
    ingredients: [],
    publisher: data.publisher,
    servings: data.servings,
    source_url: data.sourceUrl,
  };

  let error = false;
  Object.entries(data).forEach(([key, value]) => {
    if (!key.startsWith('ingredient') || !value) return;
    const ingData = value.split(',').map((data) => data.trim());
    if (ingData.length !== 3) {
      error = true;
      return;
    }
    const [quantity, unit, description] = ingData;
    recipe.ingredients.push({
      quantity,
      unit,
      description,
    });
  });

  if (error) throw new Error('Wrong ingredient fromat!');
  state.recipe = recipe;
};

export const uploadARecipe = async function (recipe) {
  try {
    // debugger;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    };
    const url = `${BASE_URL}?key=${KEY}`;

    const res = await callAJAX(url, options);
    const data = res.data.recipe;
    state.recipe = enhanceRecipeObjectKeys(data);
  } catch (err) {
    throw new Error(err.message);
  }
};

const init = function () {
  loadBookmarksFromLocalStorage();
};

// clearBookmarksFromLocalStorage();
init();
