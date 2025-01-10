const express = require("express");

const {
    bookFavorite,
    bookLastest,
    bookDetail,
    proposeBook,
    getAllBook,
    createBook,
    getAllTopic,
    createTopic
} = require("../controllers/bookController");

const router = express.Router();

router.get('/favorite-book', bookFavorite);
router.get('/lastest-book', bookLastest);
router.get('/book-detail/:id', bookDetail);
router.get('/book-proposes/:id', proposeBook);

router.get('/all-book', getAllBook);

router.post('/create-book', createBook);

router.get('/all-topic', getAllTopic);

router.post('/create-topic', createTopic);

module.exports = router;

