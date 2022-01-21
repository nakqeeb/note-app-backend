const express = require('express');

const router = express.Router();

const Category = require('../models/category');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, (req, res, next) => {
    Category.find({creator: req.userId}).then(categories => {
        if (!categories) {
            return res.status(404).json({message: 'No categories found.', success: false});
        }
        res.status(200).json({
            categories: categories
        });
    }).catch(error => {
        res.status(500).json({
          message: 'Could not get the categories.', success: false
        });
      });
});


router.get('/:categoryId', isAuth, (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id).then(category => {
        if (!category) {
            return res.status(404).json({message: 'No categories found.', success: false});
        }
        res.status(200).json({
            category: category
        });
    }).catch(error => {
        res.status(500).json({
          message: 'Could not get the category.',
          success: false
        });
      });;
});


router.post('/', isAuth, (req, res, next) => {
    const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        creator: req.userId
    });
    category.save().then(addedCategory => {
        res.status(200).json({
            category: addedCategory,
            userId: req.userId
        });
    }).catch(error => {
        res.status(500).json({
          message: 'Could not add the category.',
          success: false
        });
      });
});


router.put('/:categoryId', isAuth, (req, res, next) => {
    const id = req.params.categoryId;
    const category = {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    };
    Category.updateOne({_id: id, creator: req.userId}, category).then(result => {
        // console.log(result);
        if (result.matchedCount > 0) {
            res.status(201).json({ message: 'Updated successfully.', success: true });
        } else {
            res.status(401).json({ message: 'Not Authorized.', success: false })
        }
    }).catch(error => {
        res.status(500).json({
          message: 'Could not update the category.',
          success: false
        });
      });
});


router.delete('/:categoryId', isAuth, (req, res, next) => {
    const id = req.params.categoryId;
    Category.deleteOne({ _id: id, creator: req.userId }).then(result => {
        // console.log(result);
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Deletion successful.' });
        } else {
          res.status(401).json({ message: 'Not Authorized.', success: false });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: 'Deleting post failed!'
        })
      });;
});

module.exports = router;