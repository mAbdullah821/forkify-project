import ViewedRecipeView from './viewedRecipeView.js';
class ResultView extends ViewedRecipeView {
  _container = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';

  constructor() {
    super();
    this._addViewedRecipeEvent();
  }

  _generateRecipeBannersHtmlContent() {
    return this._data
      .map((recipe) => this._generateRecipeBannerHtmlContent(recipe))
      .join('\n');
  }

  renderResults() {
    this._render(this._generateRecipeBannersHtmlContent());
    this._selectRecipe(this._selectedRecipeId);
  }
}

export default new ResultView();
