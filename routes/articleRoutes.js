const {
  create,
  comments,
  applaud,
  showArticle,
  showAll,
  deleteArticle,
  updateArticle,
} = require("../controllers/articleController");
const Article = require("../models/articleModel");

const router = require("express").Router();

router.get("/create", (req, res) => {
  res.render("create");
});
router.get('/:id/show', showArticle)
router.get('/showAll', showAll)
router.post("/create", create);
router.get("/:id/comments", async (req, res) => {
  try {
    const id = req.params.id;
  const article = await Article.findById({_id:id});
  res.render("comments", { article });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
  
});
router.post("/:id/comments", comments);
router.post("/:id/applaud", applaud);
router.get("/:id/delete", deleteArticle)
router.put("/:id/update", updateArticle)
module.exports = router;
