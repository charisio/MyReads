import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {capitalCase} from 'text-capital-case';
import Books from './Books';

class BookShelf extends Component {
  render() {
    const {shelvedBooks, onShelfChange} = this.props;
    return (
      <div className='list-books'>
        <div className='list-books-title'>
          <h1>MyReads</h1>
        </div>
        <div className='list-books-content'>
          <div>
            {shelvedBooks &&
              Object.entries(shelvedBooks).map(([bookShelf, books]) => (
                <div key={bookShelf} className='bookshelf'>
                  <h2 className='bookshelf-title'>{capitalCase(bookShelf)}</h2>
                  <Books
                    bookShelf={bookShelf}
                    books={books}
                    onShelfChange={onShelfChange}
                  />
                </div>
              ))}
          </div>
          <div className='open-search'>
            <Link to='/search' className='search-book'>Add a book</Link>
          </div>
        </div>
      </div>
    );
  }
}

BookShelf.propTypes = {
  shelvedBooks: PropTypes.object.isRequired,
  onShelfChange: PropTypes.func.isRequired,
};

export default BookShelf;
