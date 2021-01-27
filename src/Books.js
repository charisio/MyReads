import React from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

const Books = ({books, bookShelf, onShelfChange}) => {
  return (
    <div className='bookshelf-books'>
      <ol className='books-grid'>
        {books && !books.length ? (
          <p>No books in this shelf yet!</p>
        ) : (
          books && books.length && books.map((book) => book.shelf === bookShelf && (
            <Book key={book.id} book={book} onShelfChange={onShelfChange} />
          ))
        )}
      </ol>
    </div>
  );
};

Books.propTypes = {
  bookShelf: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  onShelfChange: PropTypes.func.isRequired,
};

export default Books;
