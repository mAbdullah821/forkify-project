import { timeout } from '../helpers.js';
import View from './view.js';
class UploadRecipeView extends View {
  _displayRecipeWindowBtn = document.querySelector('.nav__btn--add-recipe');
  _closeRecipeWindowBtn = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');
  _addRecipeWindow = document.querySelector('.add-recipe-window');
  _container = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded :)';
  _errorMessage = 'Wrong ingredient fromat! Please use the correct format :)';
  _defaultForm = this._container.cloneNode(true);
  _timeoutId = 0;

  constructor() {
    super();
    this._addDisplayUploadRecipeWindowHandler();
    this._addCloseUploadRecipeWindowHandler();
    // this.addUploadRecipeHandler(() => console.log(1));
  }

  _resetUploadForm() {
    this._container.innerHTML = this._defaultForm.cloneNode(true).innerHTML;
  }

  setTimeoutId(id) {
    this._timeoutId = id;
  }

  _displayRecipeUploadForm() {
    this._resetUploadForm();
    this._overlay.classList.remove('hidden');
    this._addRecipeWindow.classList.remove('hidden');
  }

  hideRecipeUploadForm() {
    clearTimeout(this._timeoutId);
    this._overlay.classList.add('hidden');
    this._addRecipeWindow.classList.add('hidden');
  }

  _addDisplayUploadRecipeWindowHandler() {
    this._displayRecipeWindowBtn.addEventListener(
      'click',
      this._displayRecipeUploadForm.bind(this)
    );
  }

  _addCloseUploadRecipeWindowHandler() {
    this._closeRecipeWindowBtn.addEventListener(
      'click',
      this.hideRecipeUploadForm.bind(this)
    );

    this._overlay.addEventListener(
      'click',
      this.hideRecipeUploadForm.bind(this)
    );
  }

  addUploadRecipeHandler(handler) {
    this._container.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = [...new FormData(this._container)];
      const objectData = Object.fromEntries(formData);
      handler(objectData);
    });
  }
}

export default new UploadRecipeView();
