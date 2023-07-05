const Article = require("../models/articleModel");

const create = async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = await Article({ title, content });
    article.save().then((saveArticle) => {
      res.status(201).json(saveArticle);
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erreur lors de la sauvegarde de l'article` });
  }
};
const showArticle = async (req, res) => {
  const  id  = req.params.id;
  try {
    const article = await Article.findOne({_id: id});
    res.status(200).render("show", { article: article });
  } catch (error) {
    res.json({ message: "Article non trouvé" });
  }
};

const showAll = async (req, res) => {
  const  id  = req.params.id;
  try {
    const article = await Article.find();
    res.status(200).render("showall", { article: article });
  } catch (error) {
    res.json({ message: "Article non trouvé" });
  }
};

const deleteArticle = async (req, res) => {
  const articleId = req.params.id

  try {
    // Chercher et supprimer l'article
    const deletedArticle = await Article.findByIdAndDelete(articleId)

    if (!deletedArticle) {
      return res.status(404).json({ error: "Article introuvable" })
    }

    res.status(200).json({ message: "Article supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'article" })
  }
}

const updateArticle = async (req, res) => {
  const articleId = req.params.id

  try {
    // Chercher et modifier l'article
    const { title, content } = req.body
    const updatedArticle = await Article.findOneAndUpdate({ _id: articleId }, { title, content }, { new: true })

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article introuvable" })
    }

    res.status(200).json({ message: "Article modifié avec succès", updatedArticle })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification de l'article" })
  }
}


const comments = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;
    await Article.findById(id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({ error: "Article introuvable" });
        }
        const comment = { author, content };
        article.comments.push(comment);
        return article.save();
      })
      .then((updateArticle) => {
        res.json(updateArticle);
      });
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de l'ajout du commentaire` });
  }
};

const applaud = async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findById(id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({ error: "Article introuvable" });
        }
        article.applauseCount++;
        return article.save();
      })
      .then((updateArticle) => res.json(updateArticle));
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erreur lors de l'ajoout d'applaudissements` });
  }
};



module.exports = { create, comments, applaud, showArticle, showAll, deleteArticle, updateArticle};
