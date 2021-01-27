import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import * as BooksAPI from './BooksAPI';
import Book from './Book';

class Search extends Component {
  state = {
    searchString: '',
    noBooksFoundMsg: '',
    searchResults: [],
  };

  componentDidUpdate(props) {
    if (props.shelvedBooks !== this.props.shelvedBooks) {
      this.addBooksToShelf(this.state.searchResults);
    }
  }

  throttleFunc = debounce((searchString) => {
    const {setSpinner} = this.props;
    if (searchString) {
      setSpinner(true);
      BooksAPI.search(searchString, 10).then((res) => {
        if (res.error) {
          this.setState({noBooksFoundMsg: 'No books match your search criteria. Please try again.', searchResults: []});
        } else {
          this.addBooksToShelf(res);
        }
        setSpinner(false);
      });
    } else {
      this.setState({noBooksFoundMsg: '', searchResults: []});
    }
  }, 400);

  searchBooks = (e) => {
    const searchString = e.target.value;
    this.setState({searchString});
    this.throttleFunc(searchString);
  };

  addBooksToShelf = (books) => {
    const searchResults = books && books.map((book) => {
      const {shelvedBooks} = this.props;
      const _shelvedBook = [].concat(...Object.values(shelvedBooks)).find((shelvedBook) => shelvedBook.id === book.id);
      const shelf = _shelvedBook && _shelvedBook.shelf;
      book.shelf = shelf || 'none';
      return book;
    });
    this.setState({searchResults});
  };

  render() {
    const {searchString, searchResults, noBooksFoundMsg} = this.state;
    const {onShelfChange, showSpinner} = this.props;
    return (
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link className='close-search' to='/'>Close</Link>
          <div className='search-books-input-wrapper'>
            <input
              type='text'
              placeholder='Search by title or author'
              value={searchString}
              disabled={showSpinner}
              onChange={(e) => this.searchBooks(e)}
            />
          </div>
        </div>
        <div className='search-books-results'>
          <ol className='books-grid'>
            {searchResults.length ? (
              searchResults.map((book) => (
                <Book key={book.id} book={book} onShelfChange={onShelfChange} />
              ))
            ) : (
              <p>{noBooksFoundMsg}</p>
            )}
          </ol>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  shelvedBooks: PropTypes.object.isRequired,
  onShelfChange: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool.isRequired,
  setSpinner: PropTypes.func.isRequired,
};

export default Search;
