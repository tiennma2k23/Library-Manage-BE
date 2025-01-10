const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Kết nối tới MongoDB
dotenv.config();
const queryString = process.env.MONGODB_URI;

mongoose.connect(queryString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsInsecure: true
})
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

// Import Models
const Book = require('./models/Book');
const Category = require('./models/Category');

// Dữ liệu sách
const additionalBookData = [
  {
    BookID: 1,
    Title: "The Hobbit",
    Author: "J.R.R. Tolkien",
    Topic: "Fantasy",
    Subcategory: "Adventure",
    Tag: "Fiction",
    Publisher: "George Allen & Unwin",
    Publication_year: 1937,
    Edition: "First",
    Summary: "A hobbit's journey to reclaim a lost kingdom and treasure.",
    Language: "English",
    Availability: "Available",
    Rating: 4.7,
    Cover: "https://s3.amazonaws.com/gs-geo-images/cd76c55b-9830-44d9-8596-95678d41b7cf.jpg",
    CountBorrow: 250
  },
  {
    BookID: 2,
    Title: "Crime and Punishment",
    Author: "Fyodor Dostoevsky",
    Topic: "Psychological Fiction",
    Subcategory: "Classic",
    Tag: "Fiction",
    Publisher: "The Russian Messenger",
    Publication_year: 1866,
    Edition: "First",
    Summary: "A young man grapples with guilt after committing murder.",
    Language: "Russian",
    Availability: "Unavailable",
    Rating: 4.5,
    Cover: "https://m.media-amazon.com/images/I/71O2XIytdqL._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 130
  },
  {
    BookID: 3,
    Title: "The Divine Comedy",
    Author: "Dante Alighieri",
    Topic: "Epic Poetry",
    Subcategory: "Classic",
    Tag: "Fiction",
    Publisher: "John Murray",
    Publication_year: 1320,
    Edition: "First",
    Summary: "An epic journey through Hell, Purgatory, and Heaven.",
    Language: "Italian",
    Availability: "Available",
    Rating: 4.6,
    Cover: "https://m.media-amazon.com/images/I/51i-9SGWr-L._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 85
  },
  {
    BookID: 4,
    Title: "Anna Karenina",
    Author: "Leo Tolstoy",
    Topic: "Literature",
    Subcategory: "Classic",
    Tag: "Fiction",
    Publisher: "The Russian Messenger",
    Publication_year: 1878,
    Edition: "First",
    Summary: "A tragic story of love and betrayal in Russian aristocracy.",
    Language: "Russian",
    Availability: "Available",
    Rating: 4.7,
    Cover: "https://peribo.com.au/wp-content/uploads/9781853262715-15.jpg",
    CountBorrow: 90
  },
  {
    BookID: 5,
    Title: "The Odyssey",
    Author: "Homer",
    Topic: "Epic",
    Subcategory: "Ancient Greek Literature",
    Tag: "Fiction",
    Publisher: "Various",
    Publication_year: -800,
    Edition: "First",
    Summary: "The journey of Odysseus back home after the Trojan War.",
    Language: "Greek",
    Availability: "Available",
    Rating: 4.4,
    Cover: "https://m.media-amazon.com/images/I/A1JR2oK-orL._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 120
  },
  {
    BookID: 6,
    Title: "The Brothers Karamazov",
    Author: "Fyodor Dostoevsky",
    Topic: "Philosophical Fiction",
    Subcategory: "Classic",
    Tag: "Fiction",
    Publisher: "The Russian Messenger",
    Publication_year: 1880,
    Edition: "First",
    Summary: "A complex tale of faith, doubt, and family conflict.",
    Language: "Russian",
    Availability: "Unavailable",
    Rating: 4.8,
    Cover: "https://m.media-amazon.com/images/I/71OZJsgZzQL._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 95
  },
  {
    BookID: 7,
    Title: "Frankenstein",
    Author: "Mary Shelley",
    Topic: "Gothic Fiction",
    Subcategory: "Science Fiction",
    Tag: "Fiction",
    Publisher: "Lackington, Hughes, Harding, Mavor & Jones",
    Publication_year: 1818,
    Edition: "First",
    Summary: "A scientist creates a monster that turns against him.",
    Language: "English",
    Availability: "Available",
    Rating: 4.3,
    Cover: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781982146160/frankenstein-9781982146160_hr.jpg",
    CountBorrow: 175
  },
  {
    BookID: 8,
    Title: "Jane Eyre",
    Author: "Charlotte Brontë",
    Topic: "Romance",
    Subcategory: "Classic",
    Tag: "Fiction",
    Publisher: "Smith, Elder & Co.",
    Publication_year: 1847,
    Edition: "First",
    Summary: "The story of an orphaned girl and her journey to independence.",
    Language: "English",
    Availability: "Available",
    Rating: 4.6,
    Cover: "https://m.media-amazon.com/images/I/61N-UOA0alL._UF1000,1000_QL80_.jpg",
    CountBorrow: 145
  },
  {
    BookID: 9,
    Title: "Fahrenheit 451",
    Author: "Ray Bradbury",
    Topic: "Dystopian",
    Subcategory: "Science Fiction",
    Tag: "Fiction",
    Publisher: "Ballantine Books",
    Publication_year: 1953,
    Edition: "First",
    Summary: "A dystopian future where books are banned and burned.",
    Language: "English",
    Availability: "Available",
    Rating: 4.5,
    Cover: "https://upload.wikimedia.org/wikipedia/en/d/db/Fahrenheit_451_1st_ed_cover.jpg",
    CountBorrow: 180
  },
  {
    BookID: 10,
    Title: "Dracula",
    Author: "Bram Stoker",
    Topic: "Horror",
    Subcategory: "Gothic Fiction",
    Tag: "Fiction",
    Publisher: "Archibald Constable and Company",
    Publication_year: 1897,
    Edition: "First",
    Summary: "The story of the vampire Count Dracula's attempt to spread undead curse.",
    Language: "English",
    Availability: "Available",
    Rating: 4.5,
    Cover: "https://m.media-amazon.com/images/I/91wOUFZCE+L._UF1000,1000_QL80_.jpg",
    CountBorrow: 160
  },
  {
    BookID: 11,
    Title: "To Kill a Mockingbird",
    Author: "Harper Lee",
    Topic: "Classic",
    Subcategory: "Literature",
    Tag: "Fiction",
    Publisher: "J.B. Lippincott & Co.",
    Publication_year: 1960,
    Edition: "First",
    Summary: "A story of racial injustice in the Deep South.",
    Language: "English",
    Availability: "Available",
    Rating: 4.8,
    Cover: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 300
  },
  {
    BookID: 12,
    Title: "1984",
    Author: "George Orwell",
    Topic: "Dystopian",
    Subcategory: "Political Fiction",
    Tag: "Fiction",
    Publisher: "Secker & Warburg",
    Publication_year: 1949,
    Edition: "First",
    Summary: "A dystopian future under totalitarian surveillance.",
    Language: "English",
    Availability: "Available",
    Rating: 4.6,
    Cover: "https://cdn.waterstones.com/bookjackets/large/9780/1410/9780141036144.jpg",
    CountBorrow: 280
  },
  {
    BookID: 13,
    Title: "Pride and Prejudice",
    Author: "Jane Austen",
    Topic: "Romance",
    Subcategory: "Classic",
    Tag: "Fiction",
    Publisher: "T. Egerton",
    Publication_year: 1813,
    Edition: "First",
    Summary: "A witty commentary on class and marriage in 19th century England.",
    Language: "English",
    Availability: "Available",
    Rating: 4.7,
    Cover: "https://m.media-amazon.com/images/I/91uwocAMtSL._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 250
  },
  {
    BookID: 14,
    Title: "Moby-Dick",
    Author: "Herman Melville",
    Topic: "Adventure",
    Subcategory: "Sea Stories",
    Tag: "Fiction",
    Publisher: "Harper & Brothers",
    Publication_year: 1851,
    Edition: "First",
    Summary: "A quest for vengeance against the white whale, Moby-Dick.",
    Language: "English",
    Availability: "Unavailable",
    Rating: 4.4,
    Cover: "https://m.media-amazon.com/images/I/51aV053NRjL._AC_UF1000,1000_QL80_.jpg",
    CountBorrow: 200
  },
  {
    BookID: 15,
    Title: "The Great Gatsby",
    Author: "F. Scott Fitzgerald",
    Topic: "Classic",
    Subcategory: "Tragedy",
    Tag: "Fiction",
    Publisher: "Charles Scribner's Sons",
    Publication_year: 1925,
    Edition: "First",
    Summary: "A tragic story of wealth and unattainable love in the Jazz Age.",
    Language: "English",
    Availability: "Available",
    Rating: 4.6,
    Cover: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
    CountBorrow: 260
  },
  {
    BookID: 16,
    Title: "Brave New World",
    Author: "Aldous Huxley",
    Topic: "Science Fiction",
    Subcategory: "Dystopian",
    Tag: "Fiction",
    Publisher: "Chatto & Windus",
    Publication_year: 1932,
    Edition: "First",
    Summary: "A dystopian future driven by technological advances and social control.",
    Language: "English",
    Availability: "Available",
    Rating: 4.5,
    Cover: "https://upload.wikimedia.org/wikipedia/en/6/62/BraveNewWorld_FirstEdition.jpg",
    CountBorrow: 240
  },
  {
    BookID: 17,
    Title: "The Catcher in the Rye",
    Author: "J.D. Salinger",
    Topic: "Classic",
    Subcategory: "Literature",
    Tag: "Fiction",
    Publisher: "Little, Brown and Company",
    Publication_year: 1951,
    Edition: "First",
    Summary: "A young man's journey through alienation and rebellion.",
    Language: "English",
    Availability: "Available",
    Rating: 4.2,
    Cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKbLoG01sx1LqNYQjsB5mNwZVPjN71J5i6w&s",
    CountBorrow: 220
  },
  {
    BookID: 18,
    Title: "The Road",
    Author: "Cormac McCarthy",
    Topic: "Post-apocalyptic",
    Subcategory: "Survival",
    Tag: "Fiction",
    Publisher: "Alfred A. Knopf",
    Publication_year: 2006,
    Edition: "First",
    Summary: "A father and son's journey through a bleak, post-apocalyptic world.",
    Language: "English",
    Availability: "Unavailable",
    Rating: 4.3,
    Cover: "https://m.media-amazon.com/images/I/51M7XGLQTBL._AC_UF894,1000_QL80_.jpg",
    CountBorrow: 180
  },
  {
    BookID: 19,
    Title: "Don Quixote",
    Author: "Miguel de Cervantes",
    Topic: "Classic",
    Subcategory: "Adventure",
    Tag: "Fiction",
    Publisher: "Francisco de Robles",
    Publication_year: 1605,
    Edition: "First",
    Summary: "The adventures of an idealistic knight and his loyal squire.",
    Language: "Spanish",
    Availability: "Available",
    Rating: 4.6,
    Cover: "https://bookowlsbd.com/cdn/shop/files/Don-Quixote-COVER.jpg?v=1723967636",
    CountBorrow: 230
  },
  {
    BookID: 20,
    Title: "The Count of Monte Cristo",
    Author: "Alexandre Dumas",
    Topic: "Adventure",
    Subcategory: "Revenge",
    Tag: "Fiction",
    Publisher: "Pierre-Jules Hetzel",
    Publication_year: 1844,
    Edition: "First",
    Summary: "A tale of betrayal and ultimate revenge.",
    Language: "French",
    Availability: "Available",
    Rating: 4.8,
    Cover: "https://m.media-amazon.com/images/I/71zcCb5PvuL._UF1000,1000_QL80_.jpg",
    CountBorrow: 270
  }
];

// Quá trình làm mới dữ liệu
const refreshDatabase = async () => {
  try {
    // Xóa dữ liệu hiện có
    await Book.deleteMany({});
    await Category.deleteMany({});
    console.log('All books and categories deleted!');

    // Tạo danh mục từ dữ liệu sách
    const topics = [...new Set(additionalBookData.map(book => book.Topic))];
    const categories = await Category.insertMany(
      topics.map(topic => ({
        Name: topic,
        Quantity: 0 // Cập nhật sau
      }))
    );

    // Tạo map Topic -> CategoryID
    const topicToCategoryMap = {};
    categories.forEach(category => {
      topicToCategoryMap[category.Name] = category._id;
    });

    // Cập nhật dữ liệu sách
    const booksWithCategory = additionalBookData.map(book => ({
      ...book,
      Category: topicToCategoryMap[book.Topic]
    }));

    await Book.insertMany(booksWithCategory);
    console.log('Books and categories refreshed successfully!');

    // Cập nhật số lượng sách trong mỗi Category
    for (const category of categories) {
      const count = booksWithCategory.filter(book => book.Category.equals(category._id)).length;
      await Category.findByIdAndUpdate(category._id, { Quantity: count });
    }

    console.log('Category quantities updated successfully!');
  } catch (error) {
    console.error('Error refreshing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Thực thi
refreshDatabase();