class SearchView {
  _searchForm = document.querySelector('.search');
  _searchField = this._searchForm.querySelector('.search__field');

  _clearSearchField() {
    this._searchField.value = '';
  }

  getSearchQuery() {
    const query = this._searchField.value;
    this._clearSearchField();
    return query;
  }

  addSearchHandler(handler) {
    this._searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
