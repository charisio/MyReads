import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Search from './Search';
import BookShelf from './BookShelf';
import * as BooksAPI from './BooksAPI';

const shelves = ['currentlyReading', 'wantToRead', 'read'];

class BooksApp extends React.Component {
  state = {
    showSpinner: false,
    shelvedBooks: {},
  };

  componentDidMount() {
    this.getAllBooks();
  }

  getAllBooks = () => {
    this.setState({showSpinner: true});
    BooksAPI.getAll().then((books) => {
      const initialShelves = this.initShelves();
      this.addBooksToShelves(books, initialShelves);
    });
  };

  initShelves = () => {
    return shelves.reduce((acc, s) => {
      acc[s] = [];
      return acc;
    }, {});
  };

  addBooksToShelves = (books, initialShelves) => {
    const shelvedBooks = books.reduce((acc, book) => {
      const shelf = book.shelf;
      acc[shelf] = acc[shelf] ? [...acc[shelf], book] : [book];
      return acc;
    }, {});
    this.setState({
      shelvedBooks: {...initialShelves, ...this.state.shelvedBooks, ...shelvedBooks,},
      showSpinner: false,
    });
  };

  removeFromShelf = (book, shelf) => this.state.shelvedBooks[shelf].filter((b) => b.id !== book.id);

  addInShelf = (book, shelf) => {
    book.shelf = shelf;
    return [...this.state.shelvedBooks[shelf], book];
  };

  rearrangeBooksInShelves = (book, selectedShelf, previousShelf) => {
    const {shelvedBooks} = this.state;
    const booksInShelves = Object.entries(shelvedBooks).reduce((acc, [shelf, booksInShelves]) => {
      booksInShelves = (previousShelf === shelf) ? this.removeFromShelf(book, previousShelf) : booksInShelves;
      booksInShelves = (selectedShelf === shelf) ? this.addInShelf(book, selectedShelf): booksInShelves;
      acc[shelf] = [...booksInShelves];
      return acc;
    }, {});
    this.setState({shelvedBooks: booksInShelves, showSpinner: false});
  };

  onShelfChangeHandler = (book, selectedShelf, previousShelf) => {
    this.setState({showSpinner: true});
    BooksAPI.update(book, selectedShelf).then((bookResults) => {
      this.rearrangeBooksInShelves(book, selectedShelf, previousShelf);
    });
  };

  setSpinnerVisibility = showSpinner => this.setState({showSpinner});

  render() {
    const {shelvedBooks, showSpinner} = this.state;
    return (
      <BrowserRouter>
        <div className='app'>
          {showSpinner && (
            <div className='overlay'>
              <div className='spinner' />
            </div>
          )}
          <Route exact path='/' render={() => (
              <BookShelf
                shelvedBooks={shelvedBooks}
                onShelfChange={this.onShelfChangeHandler}
              />
            )}
          />
          <Route path='/search' render={() => (
              <div>
                <Search
                  shelvedBooks={shelvedBooks}
                  onShelfChange={this.onShelfChangeHandler}
                  showSpinner={showSpinner}
                  setSpinner={this.setSpinnerVisibility}
                />
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default BooksApp;
