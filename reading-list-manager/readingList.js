import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

const FILE_PATH = path.join('books.json');

function createEmptyArray() {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  return [];
}

function loadBooks() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      throw new Error('Missing file');
    }
    const books = fs.readFileSync(FILE_PATH, 'utf8');

    if (!books) {
      console.log('Books list cannot be empty');
    }

    return JSON.parse(books);
  } catch (error) {
    console.log(error.message);
    return createEmptyArray(FILE_PATH);
  }
}

function saveBooks(books) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving books:', error.message);
    return false;
  }
}

function addBook(book) {
  const books = loadBooks();
  const newBook = {
    id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
    title: book.title,
    author: book.author,
    genre: book.genre,
    read: typeof book.read === 'boolean' ? book.read : false,
  };
  const isBookAlreadyAdded = books.some(
    ({ title, author }) => title === newBook.title && author === newBook.author
  );
  if (isBookAlreadyAdded) {
    return 'The book is already added';
  }
  books.push(newBook);
  saveBooks(books);
  return newBook;
}

function getReadBooks() {
  const books = loadBooks();
  return books.filter((book) => book.read === true);
}

function getUnreadBooks() {
  const books = loadBooks();
  return books.filter((book) => book.read === false);
}

function getBooksByGenre(genre) {
  const books = loadBooks();
  return books.filter((book) => book.genre === genre);
}

function markAsRead(id) {
  const books = loadBooks();
  const updatedBooks = books.map((book) =>
    book.id === id ? { ...book, read: true } : book
  );
  saveBooks(updatedBooks);
  return `${updatedBooks.find((book) => book.id === id)?.title} by ${updatedBooks.find((book) => book.id === id)?.author} - read`;
}

function getTotalBooks() {
  return loadBooks().length;
}

function hasUnreadBooks() {
  const books = loadBooks();
  return books.some((book) => book.read === false);
}

function printAllBooks() {
  const books = loadBooks();
  let result = '';
  books.forEach((book) => {
    const { id, title, author, genre, read } = book;
    const coloredRead =
      read === true ? chalk.green('✓ Read') : chalk.yellow('⚠ Unread');
    const coloredTitle = chalk.cyan(title);
    result += `${id}. ${coloredTitle} by ${author} (${genre}) ${coloredRead}\n`;
  });
  return result;
}

function printSummary() {
  const allBooks = printAllBooks();
  const numTotalBooks = chalk.bold(getTotalBooks());
  const numReadBooks = chalk.bold.green(getReadBooks().length);
  const numUnreadBooks = chalk.bold.yellow(getUnreadBooks().length);
  return `
📚 MY READING LIST 📚

All Books:
${allBooks}

📊 SUMMARY 📊
Total Books: ${numTotalBooks}
Read: ${numReadBooks}
Unread: ${numUnreadBooks}
`;
}

export {
  loadBooks,
  saveBooks,
  addBook,
  getReadBooks,
  getUnreadBooks,
  getBooksByGenre,
  markAsRead,
  printAllBooks,
  printSummary,
};
