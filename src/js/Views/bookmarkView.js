import ViewedRecipeView from './viewedRecipeView.js';
class BookmarkView extends ViewedRecipeView {
  _container = document.querySelector('.bookmarks__list');
  _successMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _empty = true;

  constructor() {
    super();
    this._addViewedRecipeEvent();
  }

  addBookmarksHandler(handler) {
    window.addEventListener('load', handler);
  }

  removeBookmark(id) {
    this._container.querySelectorAll('.preview').forEach((bookmark, idx) => {
      const bookmarkId = bookmark
        .querySelector('.preview__link')
        .getAttribute('href')
        .slice(1);

      if (bookmarkId === id) bookmark.remove();
      // if there are more than one child element (idx will be > 0 --> [this._empty = false]) after remove one child from them there will be at least one child remaining so [this._empty = fasle]
      this._empty = idx === 0;
    });

    if (this._empty) this.renderSuccessMessage();
  }

  renderBookmark() {
    this._render(
      this._generateRecipeBannerHtmlContent(this._data),
      this._empty
    );
    this._selectRecipe(this._selectedRecipeId);
    this._empty = false;
  }
}

export default new BookmarkView();
