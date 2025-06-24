
const connectToDatabase = require('./db'); // Adjust the path as necessary
const { ObjectId } = require('mongodb');

async function name(params) {
    
}
// MongoDB Book Collection Utilities

// Find all books in a specific genre
const findByGenre = async (db, genre) => {
  return await db.collection('books').find({ genre }).toArray();
};

// Find books published after a certain year
const findByPublicationYear = async (db, year) => {
  return await db.collection('books').find({ published_year: { $gt: year } }).toArray();
};

// Find books by a specific author
const findByAuthor = async (db, author) => {
  return await db.collection('books').find({ author }).toArray();
};

// Update the price of a specific book
const updatePrice = async (db, title, newPrice) => {
  return await db.collection('books').updateOne(
    { title },
    { $set: { price: newPrice } }
  );
};

// Delete a book by its title
const deleteBook = async (db, title) => {
  return await db.collection('books').deleteOne({ title });
};

// Find books in stock and published after a certain year
const findInStockAfterYear = async (db, year) => {
  return await db.collection('books').find(
    { in_stock: true, published_year: { $gt: year } },
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).toArray();
};

// Sort books by price ascending
const sortByPriceAscending = async (db) => {
  return await db.collection('books').find(
    {},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).sort({ price: 1 }).toArray();
};

// Sort books by price descending
const sortByPriceDescending = async (db) => {
  return await db.collection('books').find(
    {},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).sort({ price: -1 }).toArray();
};

// Paginate books - 5 per page
const paginateBooks = async (db, page) => {
  const limit = 5;
  const skip = (page - 1) * limit;
  return await db.collection('books').find(
    {},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).skip(skip).limit(limit).toArray();
};

// Get average price of books by genre
const avgPriceByGenre = async (db) => {
  return await db.collection('books').aggregate([
    { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
  ]).toArray();
};

// Find the author with the most books
const authorWithMostBooks = async (db) => {
  return await db.collection('books').aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]).toArray();
};

// Group books by decade
const booksByDecade = async (db) => {
  return await db.collection('books').aggregate([
    {
      $project: {
        decade: {
          $subtract: [
            "$published_year",
            { $mod: ["$published_year", 10] }
          ]
        }
      }
    },
    {
      $group: {
        _id: "$decade",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]).toArray();
};

// Create index on title
const createTitleIndex = async (db) => {
  return await db.collection('books').createIndex({ title: 1 });
};

// Create compound index on author and published_year
const createAuthorYearIndex = async (db) => {
  return await db.collection('books').createIndex({ author: 1, published_year: 1 });
};

// Export all functions
module.exports = {
  findByGenre,
  findByPublicationYear,
  findByAuthor,
  updatePrice,
  deleteBook,
  findInStockAfterYear,
  sortByPriceAscending,
  sortByPriceDescending,
  paginateBooks,
  avgPriceByGenre,
  authorWithMostBooks,
  booksByDecade,
  createTitleIndex,
  createAuthorYearIndex
};