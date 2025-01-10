const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Đường dẫn thư mục uploads
const uploadDir = path.join(__dirname, "../uploads");

// Kiểm tra xem thư mục uploads có tồn tại không
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu không có
  console.log("Thư mục uploads đã được tạo.");
} else {
  console.log("Thư mục uploads đã tồn tại.");
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Tăng giới hạn kích thước JSON
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Router
const accountRouter = require("./routes/accountRouters");
app.use("/", accountRouter);

const bookRouter = require("./routes/bookRouters");
app.use("/book", bookRouter);

const loanRouter = require("./routes/loanRouters");
app.use("/loan", loanRouter);

// Kết nối MongoDB
dotenv.config();
const mongoose = require("mongoose");

const queryString = process.env.MONGODB_URI;

if (!queryString) {
  console.error("Error: MONGODB_URI is undefined. Please check your .env file.");
  process.exit(1);
}

mongoose
  .connect(queryString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsInsecure: true, // Bỏ qua kiểm tra SSL
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Dừng ứng dụng nếu không kết nối được
  });

// Lắng nghe các sự kiện kết nối MongoDB
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is now open!");
});

// Khởi động server
const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;