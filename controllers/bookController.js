const bookService = require("../services/bookService");
const Book = require("../models/Book");
const CategoryModel = require("../models/Category");

exports.bookFavorite = async (req, res) => {
    try {
        // Lấy ra tối đa 30 quyển sách có Rating cao nhất
        const topBooks = await Book.find()
          .sort({ Rating: -1 }) // Sắp xếp giảm dần theo Rating
          .limit(15);           // Giới hạn tối đa 30 quyển
    
        // Trả về dữ liệu dưới dạng JSON
        res.status(200).json({ success: true, data: topBooks });
    } catch (error) {
    console.error("Error fetching top-rated books:", error);
    res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.bookLastest = async (req, res) => {
    try {
        // Lấy ra tối đa 30 quyển sách được thêm vào gần đây nhất
        const latestBooks = await Book.find()
          .sort({ _id: -1 }) // Sắp xếp giảm dần theo `_id` để lấy tài liệu mới nhất
          .limit(15);         // Giới hạn tối đa 30 quyển
    
        // Trả về dữ liệu dưới dạng JSON
        res.status(200).json({ success: true, data: latestBooks });
    } catch (error) {
    console.error("Error fetching latest books:", error);
    res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.bookDetail = async (req, res) => {
    try {
        const bookID = req.params.id;

        console.log(bookID);
        if (!bookID) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }
        const bookDetail = await bookService.bookDetailSV(bookID);
        console.log(bookDetail);

        if (!bookDetail) {
            return res.status(404).json({ message: `Không tìm thấy sách với ID ${bookID}`, status: "error" });
        }

        return res.status(200).json({ bookDetail });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.proposeBook = async (req, res) => {
    try {
        const bookID = req.params.id;

        if (!bookID) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }
        const bookProposes = await bookService.proposeBookSV(bookID);

        if (!bookProposes) {
            return res.status(404).json({ message: `Không tìm thấy sách với ID ${bookID}`, status: "error" });
        }

        return res.status(200).json({ bookProposes });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.getAllBook = async (req, res) => {
    try {
        const allBook = await bookService.getAllBookSV();

        if (!allBook) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            return res.status(200).json({ success: true, data: allBook });
        }

    } catch (error) {
        console.error("Error fetching all books:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            topic,
            subcategory,
            tag,
            publisher,
            publication_year,
            edition,
            summary,
            language,
            cover
        } = req.body;

        let categoryID = null;

        // Nếu topic được cung cấp, tìm Category bằng tên
        if (topic) {
            const category = await CategoryModel.findOne({ Name: topic });
            if (!category) {
                return res.status(400).json({ success: false, message: "Category không tồn tại" });
            }
            categoryID = category._id; // Lấy CategoryID từ kết quả tìm kiếm
        }

        // Nếu không có topic, bạn có thể xử lý theo cách khác hoặc để null (trường hợp này có thể có logic thêm để xử lý)
        if (!categoryID) {
            return res.status(400).json({ success: false, message: "Category không xác định" });
        }

        // Lấy BookID cao nhất từ cơ sở dữ liệu
        const lastBook = await Book.findOne().sort({ BookID: -1 }).exec();
        const newBookID = lastBook ? lastBook.BookID + 1 : 1; // Nếu không có sách nào, bắt đầu từ 1

        // Tạo dữ liệu sách
        const bookData = {
            BookID: newBookID, // Gán BookID mới
            Title: title,
            Author: author,
            Category: categoryID, // Liên kết với CategoryID
            Subcategory: subcategory,
            Tag: tag,
            Publisher: publisher,
            Publication_year: publication_year,
            Edition: edition,
            Summary: summary,
            Language: language,
            Cover: cover, // Cover là base64, lưu dưới dạng String
            Availability: 'Available', // Mặc định là 'Available'
            Rating: 0, // Mặc định là 0
            CountBorrow: 0 // Mặc định là 0
        };

        // Gọi hàm tạo sách
        const book = await bookService.createBookSV(bookData);

        // Nếu không tạo được sách
        if (!book) {
            return res.status(500).json({ success: false, message: "Không thể tạo sách" });
        }

        // Trả về sách vừa tạo
        return res.status(201).json({ success: true, data: book });
    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
}

exports.getAllTopic = async (req, res) => {
    try {
        // Lấy tất cả các chủ đề (topics)
        const allTopic = await bookService.getAllTopicSV();

        // Nếu không có topic nào
        if (!allTopic || allTopic.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        } else {
            // Duyệt qua các topic và lấy cover của sách đầu tiên trong mỗi topic
            const topicWithBooks = await Promise.all(allTopic.map(async (topic) => {
                // Giả sử mỗi topic có trường _id, tìm các sách với topic này
                const books = await Book.find({ Category: topic._id }).select('Cover'); // Lấy cover của sách

                // Nếu có sách, lấy cover của sách đầu tiên
                const cover = books.length > 0 ? books[0].Cover : null;

                return {
                    topic: topic.Name,  // Hoặc tên topic tùy vào cấu trúc của bạn
                    cover: cover        // Chỉ trả về cover của quyển sách đầu tiên
                };
            }));

            // Trả về thông tin topic và cover của sách đầu tiên
            return res.status(200).json({ success: true, data: topicWithBooks });
        }

    } catch (error) {
        console.error("Error fetching all topics:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.createTopic = async (req, res) => {
    const topic = req.body.topic;

    try {
        // Tạo topic mới bằng service
        const newTopic = await bookService.createTopicSV(topic);

        if (!newTopic) {
            return res.status(404).json({ success: false, message: "Không thể tạo chủ đề" });
        }

        return res.status(200).json({ success: true, data: newTopic });
    } catch (error) {
        console.error("Lỗi khi tạo chủ đề:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};