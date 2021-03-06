const express = require('express');
const booksController = require('../controllers/booksController');
function routes(Book){
  const bookRouter = express.Router();
  const controller = booksController(Book);
  bookRouter.route('/books')
//making query string param
  .post(controller.post) 
  .get(controller.get)
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
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if(err) {
          return res.send(err);
        }
        return res.sendStatus(204);
    });
  });
  return bookRouter;
}

module.exports = routes;