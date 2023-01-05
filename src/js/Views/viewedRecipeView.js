import View from './view.js';
import icons from 'url:../../img/icons.svg';

export default class ViewedRecipeView extends View {
  _selectedRecipeId;
  _data;

  loadData(data) {
    this._data = data;
  }

  _selectRecipe(id) {
    if (!id) return;
    if (this._selectedRecipeId)
      this._container
        .querySelector(`a[href="#${this._selectedRecipeId}"]`)
        ?.classList.remove('preview__link--active');

    this._container
      .querySelector(`a[href="#${id}"]`)
      ?.classList.add('preview__link--active');
    this._selectedRecipeId = id;
  }

  _addViewedRecipeEvent() {
    ['load', 'hashchange'].forEach((e, idx) =>
      window.addEventListener(e, () => {
        const id = window.location.hash.slice(1);
        if (!id) return;
        // if idx === 1 [hashchange] --> this._selectRecipe(id)
        idx ? this._selectRecipe(id) : (this._selectedRecipeId = id);
      })
    );
  }

  _generateRecipeBannerHtmlContent(recipe) {
    return `
      <li class="preview">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
          </div>
          </div>
        </a>
      </li>
    `;
  }
}
