const Loan = require("../models/Loan");
const User = require("../models/Account");
const Book = require("../models/Book");
const { format } = require("date-fns");

exports.createLoan = async (userEmail, bookID, phone, address, countDay, frontImage, backImage, note) => {
    try {
        const nowUTC = new Date();
        const dayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam (UTC+7)

        // Kiểm tra số ngày mượn hợp lệ
        const countDayInt = parseInt(countDay, 10);
        if (isNaN(countDayInt) || countDayInt <= 0) {
            throw new Error("Số ngày mượn không hợp lệ");
        }

        // Tính ngày kết thúc
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + countDayInt);

        // Lấy LoanID mới
        const lastLoan = await Loan.findOne().sort({ LoanID: -1 });
        const newLoanID = lastLoan ? lastLoan.LoanID + 1 : 1;

        // Tìm người dùng
        const user = await User.findOne({ Email: userEmail });
        const userID = user._id;

        // Cập nhật thông tin người dùng
        const userUpdate = await User.findByIdAndUpdate(
            { _id: userID },
            {
                Phone: phone,
                Address: address,
                FrontImage: frontImage[0].filename,  // Lưu tên file
                BackImage: backImage[0].filename     // Lưu tên file
            },
            { new: true }
        );

        if (!userUpdate) {
            throw new Error("Không tìm thấy người dùng để cập nhật");
        }

        // Cập nhật sách
        const bookUpdate = await Book.findByIdAndUpdate(
            { _id: bookID },
            { Availability: "Unavailable" },
            { new: true }
        );

        if (!bookUpdate) {
            throw new Error("Không tìm thấy sách để cập nhật");
        }

        // Tạo đơn mượn
        const loan = await Loan.create({
            LoanID: newLoanID,
            AccountID: userID,
            BookID: bookID,
            DayStart: dayStart,
            DayEnd: dayEnd,
            Note: note,
            State: "Yêu cầu mượn"
        });

        return loan;
    } catch (error) {
        console.error("Error in loanService.createLoan:", error.message);
        throw error;
    }
};

exports.getAllLoanSV = async (userEmail) => { 
    try {
        const user = await User.findOne({ Email: userEmail });
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        const role = user.Role;

        if (role == "user") {
            const loans = await Loan.find({ AccountID: user._id })
                .sort({ LoanID: -1 });

            // Đảm bảo trả về ngày theo định dạng ISO string
            const formattedLoans = loans.map((loan) => ({
                ...loan._doc, // Bảo toàn các trường khác
                DayStart: loan.DayStart.toISOString(),  // Định dạng dưới dạng ISO string
                DayEnd: loan.DayEnd.toISOString(),     // Định dạng dưới dạng ISO string
            }));

            return formattedLoans;
        } else if (role == "admin") {
            const loans = await Loan.find({})
                .sort({ LoanID: -1 });

            // Đảm bảo trả về ngày theo định dạng ISO string
            const formattedLoans = loans.map((loan) => ({
                ...loan._doc, // Bảo toàn các trường khác
                DayStart: loan.DayStart.toISOString(),  // Định dạng dưới dạng ISO string
                DayEnd: loan.DayEnd.toISOString(),     // Định dạng dưới dạng ISO string
            }));

            return formattedLoans;
        }    
    } catch (err) {
        console.error("Lỗi trong loanService.getAllLoanSV: ", err.message);
        throw err;
    }
};

exports.getALoanSV = async (loanID) => {
    try {
        return Loan.findById({ _id: loanID });
    } catch (err) {
        console.error("Lỗi trong getALoanSV: ", err.message);
        throw err;
    }
};

exports.acceptLoanSV = async(loanID, state) => {
    try {
        const loan = await Loan.findOne({ _id: loanID });
        if (!loan) {
            throw new Error("Loan không tồn tại");
        }

        if(state == "Yêu cầu mượn") {
            loan.State = "Đang mượn";
            
            // Lấy số ngày mượn từ dữ liệu cũ
            const oldDayStart = new Date(loan.DayStart);
            const oldDayEnd = new Date(loan.DayEnd);

            if (!oldDayStart || !oldDayEnd || isNaN(oldDayStart) || isNaN(oldDayEnd)) {
                throw new Error("DayStart hoặc DayEnd cũ không hợp lệ");
            }

            // Tính số ngày mượn
            const diffTime = Math.abs(oldDayEnd - oldDayStart); // Thời gian chênh lệch (ms)
            const countDayBorrowed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const nowUTC = new Date();
            loan.DayStart = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam (UTC+7)

            // Tính ngày kết thúc
            loan.DayEnd = new Date(loan.DayStart);
            loan.DayEnd.setDate(loan.DayEnd.getDate() + countDayBorrowed);
            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";
            book.CountBorrow += 1;

            await loan.save();
            await book.save();

            return loan;
        } else if(state == "Đang mượn") {
            loan.State = "Đã trả";
            const nowUTC = new Date();
            loan.DayEnd = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);
            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";

            await loan.save();
            await book.save();

            return loan;
        } else if(state == "Từ chối") {
            loan.State = "Đã từ chối";
            const book = await Book.findOne({ _id: loan.BookID });
            book.Availability = "Available";

            await loan.save();
            await book.save();

            return loan;
        }  
    } catch (err) {
        console.error("Lỗi trong loanService.acceptLoanSV: ", err.message);
        throw err;
    }
}