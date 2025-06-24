// Task 2: Basic CRUD Operations

// 1. Find all books in a specific genre (e.g., "Fiction")
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year (e.g., 2015)
db.books.find({ published_year: { $gt: 2015 } });

// 3. Find books by a specific author (e.g., "Author A")
db.books.find({ author: "Author A" });

// 4. Update the price of a specific book (e.g., "Book 1")
db.books.updateOne(
  { title: "Book 1" },
  { $set: { price: 25.99 } }
);

// 5. Delete a book by its title (e.g., "Book 2")
db.books.deleteOne({ title: "Book 2" });


// Task 3: Advanced Queries

// 1. Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 2. Projection: return only title, author, and price fields
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// 3. Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// 4. Sort books by price (descending)
db.books.find().sort({ price: -1 });

// 5. Pagination: 5 books per page (page 1)
db.books.find().skip(0).limit(5);
// Pagination: 5 books per page (page 2)
db.books.find().skip(5).limit(5);


// Task 4: Aggregation Pipeline

// 1. Calculate the average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
]);

// 2. Find the author with the most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  { $project: { decade: { $concat: [ { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } }, "s" ] } } },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);


// Task 5: Indexing

// 1. Create an index on the title field
db.books.createIndex({ title: 1 });

// 2. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// 3. Use explain() to demonstrate performance improvement
db.books.find({ title: "Book 1" }).explain("executionStats");
db.books.find({ author: "Author A", published_year: { $gt: 2010 } }).explain("executionStats");