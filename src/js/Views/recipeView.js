import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView extends View {
  _container = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _defaultMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';
  _ingredientQuantityElments;
  _updataServingBtns;
  _data;

  loadData(data) {
    this._data = data;
  }

  loadUpdatedIngredient(newIngredient) {
    this._data.ingredients = newIngredient;
  }

  _selectNeededDomElements() {
    this._ingredientQuantityElments = document.querySelectorAll(
      '.recipe__ingredient-list .recipe__ingredient .recipe__quantity'
    );

    this._updataServingBtns = document.querySelectorAll(
      '.recipe__info-buttons button'
    );
  }

  _updateServingButtons(servings) {
    this._updataServingBtns.forEach(
      (btn, idx) => (btn.dataset.toServe = servings + idx * 2 - 1)
    );
  }

  _updataServingsInfo(servings) {
    // Update servings count which appears in the UI
    document.querySelector('.recipe__info-data--people').textContent = servings;

    this._updateServingButtons(servings);
  }

  addRenderRecipeHandler(handler) {
    ['hashchange', 'load'].forEach((e) => window.addEventListener(e, handler));
  }

  addUpdateServingsHandler(handler) {
    this._container.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const newServings = +btn.dataset.toServe;
      if (newServings < 1) return;

      this._updataServingsInfo(newServings);
      handler(newServings);
    });
  }

  addBookmarkHandler(handler) {
    this._container.addEventListener('click', (e) => {
      const bookmarkBtn = e.target
        .closest('.btn--bookmark')
        ?.querySelector('use');
      if (!bookmarkBtn) return;

      const iconSrc = bookmarkBtn.getAttribute('href');
      //Handle the bookmark icon
      if (iconSrc.slice(-4) === 'fill')
        bookmarkBtn.setAttribute('href', iconSrc.slice(0, -5));
      else bookmarkBtn.setAttribute('href', iconSrc + '-fill');
      // handle the bookmark array
      handler();
    });
  }

  // MARK: Generate Html Content Part
  _toFraction(num) {
    return num ? new Fraction(num).toString() : '';
  }

  _generateIngredientHtmlContnet(ingredient) {
    return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${this._toFraction(ingredient.quantity)}</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ingredient.unit}</span>
      ${ingredient.description}
    </div>
  </li>`;
  }

  _generateAllIngredientHtmlContnet(ingredients) {
    return ingredients.reduce(
      (acc, ing) => acc + `\n` + this._generateIngredientHtmlContnet(ing),
      ''
    );
  }

  _generateRecipeHtmlContnet() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button data-to-serve="${
                this._data.servings - 1
              }" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-to-serve="${
                this._data.servings + 1
              }" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmark ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._generateAllIngredientHtmlContnet(this._data.ingredients)}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
  // MARK: Render Part

  resetRecipeContainer() {
    this.renderSuccessMessage(this._defaultMessage);
  }

  renderRecipe() {
    this._render(this._generateRecipeHtmlContnet());
    this._selectNeededDomElements();
  }

  renderNewRecipeIngredientQuantity() {
    this._ingredientQuantityElments.forEach((quantityEl, idx) => {
      quantityEl.textContent = this._toFraction(
        this._data.ingredients[idx].quantity
      );
    });
  }
}

export default new RecipeView();
