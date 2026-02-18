import {
  loadBooks,
  addBook,
  getReadBooks,
  getBooksByGenre,
  markAsRead,
  printAllBooks,
  printSummary,
} from './readingList.js';

function app() {
  console.log(loadBooks());
  console.log(
    addBook({
      id: 8,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      read: false,
    })
  );
  console.log(printAllBooks());
  console.log(getReadBooks());
  console.log(getBooksByGenre('Self-Help'));
  console.log(markAsRead(3));
  console.log(printSummary());
}
app();