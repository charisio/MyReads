import React from 'react';
import PropTypes from 'prop-types';

const Book = ({book, onShelfChange}) => {
  const getBookThumbnail = (book) => book.imageLinks ? `url(${book.imageLinks.thumbnail})` : 'none';
  const onShelfChangeHandler = (e) => {
  	onShelfChange(book, e.target.value, book.shelf)
  }
  return (
    <li>
      <div className='book'>
        <div className='book-top'>
          <div className='book-cover' style={{width: 128, height: 193, backgroundImage: getBookThumbnail(book),}}></div>
          <div className='book-shelf-changer'>
            <select
              value={book.shelf}
              onChange={(e) => onShelfChangeHandler(e)}>
              <option value='move' disabled> Move to... </option>
              <option value='currentlyReading'>Currently Reading</option>
              <option value='wantToRead'>Want to Read</option>
              <option value='read'>Read</option>
              <option value='none'>None</option>
            </select>
          </div>
        </div>
        <div className='book-title'>{book.title}</div>
        <div className='book-authors'>
          {book.authors && book.authors.toString()}
        </div>
      </div>
    </li>
  );
};

Book.propTypes = {
  book: PropTypes.object.isRequired,
  onShelfChange: PropTypes.func.isRequired,
};

export default Book;
