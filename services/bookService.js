const BookModel = require("../models/Book");
const CategoryModel = require("../models/Category");

exports.bookDetailSV = async(bookID) => {
    const book = await BookModel.findById({ _id: bookID });
    console.log(book);
    return book;
}

exports.proposeBookSV = async (bookID) => {
    try {
        // Tìm sách theo ID
        const book = await BookModel.findById({ _id: bookID }).populate('CategoryID');
        if (!book) {
            throw new Error('Không tìm thấy sách với ID đã cho');
        }

        // Tìm các sách cùng Category nhưng loại trừ sách hiện tại
        const sameCategoryBooks = await BookModel.find({
            CategoryID: book.CategoryID._id, // Sử dụng CategoryID để so sánh
            _id: { $ne: bookID } // Loại trừ sách hiện tại
        }).populate('CategoryID'); // Thêm thông tin chi tiết về Category nếu cần

        return sameCategoryBooks;
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sách đề xuất');
    }
};

exports.getAllBookSV = async () => {
    try {
        // Sử dụng populate để lấy thông tin Category thông qua CategoryID
        return await BookModel.find({}).populate('Category');
    } catch (error) {
        console.error("Error in getAllBookSV:", error);
        throw error;
    }
};

exports.createBookSV = async (bookData) => {
    try {
        // Tạo sách mới với dữ liệu đã bao gồm các giá trị mặc định
        const newBook = new BookModel(bookData);

        // Lưu sách vào cơ sở dữ liệu
        const savedBook = await newBook.save();

        // Cập nhật số lượng sách trong Category
        await CategoryModel.findByIdAndUpdate(
            bookData.Category,  // Sử dụng Category ID đã được chuyển thành ObjectId
            { $inc: { Quantity: 1 } },
            { new: true } // Trả về đối tượng cập nhật
        );

        // Trả về sách đã được populate với Category
        const populatedBook = await BookModel.findById(savedBook._id).populate('Category');
        return populatedBook;
    } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Error saving book");
    }
};

exports.getAllTopicSV = async () => {
    try {
        return await CategoryModel.find({});
    } catch (error) {
        console.error("Error in getAllTopicSV:", error);
        throw error;
    }
};

exports.createTopicSV = async (topicData) => {
    try {
        // Tạo một Category mới
        const newCategory = new CategoryModel({
            Name: topicData.topic,
            Quantity: 0, // Số lượng mặc định là 0
        });

        // Lưu Category mới vào cơ sở dữ liệu
        const savedCategory = await newCategory.save();

        return savedCategory;
    } catch (error) {
        console.error("Lỗi khi lưu chủ đề:", error);
        throw new Error("Lỗi khi lưu chủ đề");
    }
};
