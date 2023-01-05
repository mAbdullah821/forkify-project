import icons from 'url:../../img/icons.svg';

export default class View {
  _successMessage = '';
  _errorMessage = '';
  _container;
  // MARK: Generate Html Content Part
  _generateSuccessMessageHtmlContent(message) {
    return `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
  }

  _generateErrorMessageHtmlContent(message) {
    return `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
  }

  _generateSpinnerHtmlContent() {
    return `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
  }
  // MARK: Render Part

  _cleareContainer() {
    this._container.innerHTML = '';
  }

  _render(htmlContnet, clear = true) {
    if (clear) this._cleareContainer();
    this._container.insertAdjacentHTML('afterbegin', htmlContnet);
  }

  renderSuccessMessage(message = this._successMessage) {
    this._render(this._generateSuccessMessageHtmlContent(message));
  }

  renderErrorMessage(message = this._errorMessage) {
    this._render(this._generateErrorMessageHtmlContent(message));
  }

  renderSpinner() {
    this._render(this._generateSpinnerHtmlContent());
  }
}
