const express = require('express');

let { validateToken } = require('../middlewares/authentication');

const app = express();
const Product = require('../models/product');

// =============
// Search Products
// =============

app.get('/products/search/:filter', validateToken, (req, res) => {
  let filter = req.params.filter;
  let regex = new RegExp(filter, 'i');

  Product.find({ name: regex })
    .populate('category', 'name')
    .exec((err, products) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        products
      });
    })
});


// =============
// Create a Product
// =============
app.post('/product', validateToken, (req, res) => {
  let body = req.body;

  let product = new Product({
    name: body.name,
    price: body.price,
    description: body.description,
    available: body.available,
    user: req.user._id,
    category: body.category
  });
  
  product.save((err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.status(201).json({
      ok: true,
      product: productDB
    });
  });
});

// =============
// Get All Products
// =============
app.get('/product', validateToken, (req, res) => {
  let from = req.query.from || 0;
  from = Number(from);

  let limit = req.query.limit || 5;
  limit = Number(limit)

  Product.find({ available: true })
    .skip(from)
    .limit(limit)
    .populate('user', 'name email')
    .populate('category', 'name')
    .exec((err, productsDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    Product.count({ available: true }, (err, total) => {
      res.json({
        ok: true,
        products: productsDB,
        total
      });
    });

    // res.json({
    //   ok: true,
    //   products: productsDB
    // });
  });
});

// =============
// Get Product by ID
// =============
app.get('/product/:id', validateToken, (req, res) => {
  let id = req.params.id;

  Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'name')
    .exec((err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Product not found'
        }
      });
    }   

    res.json({
      ok: true,
      product: productDB
    });
  });
});

// =============
// Update a product
// =============
app.put('/product/:id', validateToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let data = {
    name: body.name
  };

  if (body.name) {
    data.name = body.name;
  }

  if (body.price) {
    data.price = body.price;
  }

  if (body.description) {
    data.description = body.description;
  }

  if (body.available) {
    data.available = body.available;
  }

  if (body.category) {
    data.category = body.category
  }

  Product.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Product not found'
        }
      });
    }

    res.json({
      ok: true,
      product: productDB
    })

  });

});

// =============
// Delete a Product
// =============

app.delete('/product/:id', validateToken, (req, res) => {
  let id = req.params.id;

  Product.findByIdAndUpdate(id, { available: false }, (err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Product not found'
        }
      });
    }

    return res.json({
      ok: true,
      message: 'The product as been removed'
    })

  });
});
module.exports = app;