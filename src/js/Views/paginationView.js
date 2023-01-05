import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _container = document.querySelector('.pagination');
  _page = null;
  _totalPages = null;

  loadPaginationInfo(page, totalPages) {
    this._page = page;
    this._totalPages = totalPages;
  }

  addPaginationHandler(handler) {
    this._container.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      this._page = +btn.dataset.topage;
      handler(this._page);
    });
  }
  // MARK: Generate Html Content Part
  _generateRightButtonHtmlContent() {
    return `
      <button data-topage="${
        this._page + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this._page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }

  _generateLeftButtonHtmlContent() {
    return `
      <button data-topage="${
        this._page - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._page - 1}</span>
      </button>`;
  }
  // MARK: Render Part
  _renderRightButton() {
    this._render(this._generateRightButtonHtmlContent());
  }

  _renderLeftButton() {
    this._render(this._generateLeftButtonHtmlContent());
  }

  _renderLeftRightButtons() {
    this._render(
      this._generateLeftButtonHtmlContent() +
        this._generateRightButtonHtmlContent()
    );
  }

  renderPaginationButtons() {
    if (this._page === 1 && this._totalPages > 1) this._renderRightButton();
    else if (this._page < this._totalPages) this._renderLeftRightButtons();
    else if (this._page === this._totalPages && this._totalPages > 1)
      this._renderLeftButton();
  }
}

export default new PaginationView();
