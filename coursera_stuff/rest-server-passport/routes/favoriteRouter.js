var express = require('express')
var bodyParser = require('body-parser')
// var mongoose = require('mongoose')
var Favorites = require('../models/favorites')

var favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())
var Verify = require('./verify')
favoriteRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._doc._id
    Favorites.findOne({ postedBy: userId })
      .populate('postedBy')
      .populate('dishes')
      .exec(function (err, favorite) {
        if (err) throw err
        res.json(favorite)
      })
  })

  .post(Verify.verifyOrdinaryUser, function (req, res, next) {
      var favoredDish = {}
      favoredDish.postedBy = req.decoded._doc._id
      favoredDish.dishes = [req.body._id]
      // check existance of favorites document
      Favorites.count({ postedBy: favoredDish.postedBy }, function (err, count) {
        if (err) throw err
        if (count > 0) {
            // if exists - find it
            Favorites.findOne({ postedBy: favoredDish.postedBy },function (err, favorite) {
              if (err) throw err
              //if dishId already in document then do nothing
              if (favorite.dishes.indexOf(favoredDish.dishes[0]) > -1) {
                  console.log('that favorite already exists in your list');
                  res.writeHead(200, {'Content-Type': 'text/plain'})
                  res.end('that favorite already exists in your list')
              // else we will update it
              } else {
                  favorite.dishes.push(favoredDish.dishes[0])
                  favorite.save(function (err, data) {
                    if (err) throw err
                    console.log('Added dishId to the list');
                    res.json(data)
                  })
              }
            })
        // if there are no favorites document yet - then create one
        } else {
            Favorites.create(favoredDish,function (err, data) {
               if (err) return next(err)
               console.log('created new favorites list');
               res.json(data)
           })
        }
        })
  })

  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._doc._id
    Favorites.remove({ postedBy: userId }, function (err, resp) {
      if (err) throw err
      res.json(resp)
    })
  })

favoriteRouter.route('/:dishId')
  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._doc._id
    var dishId = req.params.dishId
    Favorites.findOneAndUpdate({ postedBy: userId },  { $pull: { dishes: dishId } }, function (err, resp) {
      if (err) throw err
      res.json(resp)
    })
  })

module.exports = favoriteRouter
