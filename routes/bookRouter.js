const express = require('express');

function routes(Book){
  const bookRouter = express.Router();
  bookRouter.route('/books')
//making query string param
  .post((req, res) => {
    const book = new Book(req.body);
//saving post responses to book 
    book.save();
    return res.status(201).json(book);
  })
  .get((req, res) => {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  });
  //middleware so we stay DRY
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if(book) {
        req.book = book;
        return next();
      }
        return res.sendStatus(404);
    });
  });
  bookRouter.route('/books/:bookId')
//find book by id
  .get((req, res) => res.json(req.book))
  //update a specific record of book
  .put((req, res) => {
    const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      book.save();

      return res.json(book);
    });
  return bookRouter;
}

module.exports = routes;