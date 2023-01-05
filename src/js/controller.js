// import icons from 'url:../img/icons.svg';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultView from './Views/resultView.js';
import paginationView from './Views/paginationView.js';
import bookmarkView from './Views/bookmarkView.js';
import uploadRecipeView from './Views/uploadRecipeView.js';
import * as model from './model.js';
import {
  DEFAULT_ID,
  LAND_PAGE,
  TIME_TO_HIDE_UPLOAD_FORM_IN_SEC,
} from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// const defaultId = '5ed6604591c37cdc054bc886';
const recipeController = async function () {
  try {
    // const id = DEFAULT_ID; // For Testing;
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    await model.fetchRecipeData(id);
    recipeView.loadData(model.state.recipe);
    recipeView.renderRecipe();
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const servingsController = function (servings) {
  model.updateRecipeIngredientQuantity(servings);
  recipeView.loadUpdatedIngredient(model.state.recipe.ingredients);
  recipeView.renderNewRecipeIngredientQuantity();
};

const searchResultController = async function () {
  try {
    // 1) Load search query
    const query = searchView.getSearchQuery();
    if (!query) return;
    // 2) Render a spinner untill fetching the result of search query
    resultView.renderSpinner();
    await model.fetchSearchQueryResult(query);
    // 3) Check if that query exist and calculate total recipe pages
    if (model.state.search.result.length === 0)
      throw new Error(
        `Can't find any result for [${query}] try another search query.`
      );

    const totalPages = Math.ceil(
      model.state.search.result.length / model.state.search.recipesPerPage
    );
    // 4) Load appropriate data for both result and pagination viewers
    resultView.loadData(model.getRecipesOfPage(LAND_PAGE));
    paginationView.loadPaginationInfo(LAND_PAGE, totalPages);
    // 5) Render the data and pagination buttons
    resultView.renderResults();
    paginationView.renderPaginationButtons();
    // console.log(model.state.search.query);
    // console.log(model.state.search.result);
  } catch (err) {
    // console.error(err.message);
    resultView.renderErrorMessage();
  }
};

const paginationController = function (page) {
  resultView.loadData(model.getRecipesOfPage(page));
  resultView.renderResults();
  paginationView.renderPaginationButtons();
};

const renderBookmark = function (bookmark) {
  bookmarkView.loadData(bookmark);
  bookmarkView.renderBookmark();
};

const addAndRenderBookmark = function () {
  model.bookmarkARecipe(model.state.recipe);
  renderBookmark(model.state.recipe);
};

const bookmarkController = function () {
  if (model.state.recipe.bookmark) {
    // Remove bookmark
    model.removeRecipeBookmark(model.state.recipe.id);
    bookmarkView.removeBookmark(model.state.recipe.id);
  } else {
    addAndRenderBookmark(model.state.recipe);
  }
};

const renderLocalStorageBookmarksController = function () {
  // Don't continue the execution of the function if there are no bookmarks.
  if (!model.state.bookmarks.length) return;
  model.state.bookmarks.forEach((bookmark) => renderBookmark(bookmark));
};

const autoHideUploadRecipeForm = function () {
  const timeoutId = setTimeout(() => {
    uploadRecipeView.hideRecipeUploadForm();
  }, TIME_TO_HIDE_UPLOAD_FORM_IN_SEC * 1000);
  // Add timeout id to the upload RecipeView to disable the timeout if the user close the upload form immediately after uploading done successfully
  uploadRecipeView.setTimeoutId(timeoutId);
};

const uploadRecipeController = async function (formData) {
  try {
    //TODO:
    uploadRecipeView.renderSpinner();
    // 1) Prepare recipe data for uploading
    model.createRecipeObjectForUploading(formData); // Store it in model.state.recipe
    // 2) Upload the recipe
    await model.uploadARecipe(model.state.recipe);
    // 3) Add the recipe to bookmarks
    addAndRenderBookmark(model.state.recipe);
    // 4) Render the new recipe into recipe view
    window.location.hash = `${model.state.recipe.id}`;
    // 5) Render success upload message and hide the upload form
    uploadRecipeView.renderSuccessMessage();
    autoHideUploadRecipeForm();
  } catch (err) {
    uploadRecipeView.renderErrorMessage();
    autoHideUploadRecipeForm();
  }
};

const init = function () {
  recipeView.addRenderRecipeHandler(recipeController);
  recipeView.addUpdateServingsHandler(servingsController);
  recipeView.addBookmarkHandler(bookmarkController);
  searchView.addSearchHandler(searchResultController);
  bookmarkView.addBookmarksHandler(renderLocalStorageBookmarksController);
  paginationView.addPaginationHandler(paginationController);
  uploadRecipeView.addUploadRecipeHandler(uploadRecipeController);
};

init();
