const { Router } = require("express");
const BooksCollection = require("../models").booksCollection;
const Book = require("../models").book;
const Review = require("../models").review;
const User = require("../models").user;
const Collection = require("../models").collection;

const router = new Router();

router.get("/", (req, res, next) => {
  const limit = Math.min(parseInt(req.query.limit) || 25, 500);
  const offset = parseInt(req.query.offset) || 0;

  BooksCollection.findAndCountAll({
    include: [
      {
        model: Book,
      },
      {
        model: Review,
      },
      {
        model: Collection,
        include: [
          {
            model: User,
          },
        ],
      },
    ],
    limit,
    offset,
  })
    .then((result) =>
      res.send({ bookscollections: result.rows, total: result.count })
    )
    .catch((error) => next(error));
});

router.get("/collection/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booksCollections = await BooksCollection.findAll({
      where: {
        collectionId: id,
      },
      include: [Book, Collection],
    });
    return res.send(booksCollections);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong" });
  }
});

module.exports = router;
