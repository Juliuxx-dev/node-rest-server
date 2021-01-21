const express = require('express');

let app = express();
const bcrypt = require('bcrypt');
let { validateToken, isAdmin } = require('../middlewares/authentication');

let Category = require('../models/category');

/**
 * =================
 * Get all categories
 * =================
*/

app.get('/category', validateToken, (req, res) => {
  Category.find({})
    .sort('name')
    .populate('user', 'name email')
    .exec((err, categories) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categories) {
      return res.status(404).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categories
    });
  });
});


/**
 * ===========
 * Get category by id
 * ===========
*/

app.get('/category/:id', validateToken, (req, res) => {
  let id = req.params.id;

  Category.findById(id, (err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoryDB) {
      return res.status(404).json({
        ok: false,
        message: 'Category not found'
      });
    }

    res.json({
      ok: true,
      category: categoryDB
    });
  });
});

/**
 * ============
 * New Category
 * ============
*/

app.post('/category', validateToken, (req, res) => {
  let body = req.body;

  let category = new Category({
    name: body.name,
    user: req.user._id
  });

  category.save((err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    
    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      category: categoryDB
    });
  });
});

/**
 * ===========
 * UPDATE a category
 * ===========
*/

app.put('/category/:id', validateToken, (req, res) => {
  let body = req.body;
  let id = req.params.id;

  Category.findByIdAndUpdate(id, { name: req.body.name }, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    
    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Category not found'
        }
      })
    }

    res.json({
      ok: true,
      category: categoryDB
    });
  });
});

/**
 * ===========
 * Delete a category
 * ===========
*/
app.delete('/category/:id', [validateToken, isAdmin], (req, res) => {
  let id = req.params.id;

  Category.findByIdAndDelete(id, (err, categoryDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Category not found'
        }
      })
    }

    res.json({
      ok: true,
      message: 'Category deleted'
    });
  });
});

module.exports = app;