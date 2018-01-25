var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes');
var Promotions = require('./models/promotions');
var Leadership = require('./models/leadership');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // Dishes test
    Dishes.create({
        name: 'Uthapizza',
        image: "images/uthapizza.png",
        category: "mains",
        label: "Hot",
        price: "4.99",
        description: 'Unique...',
        comments: [
          {
            rating: 5,
            comment: "Imagine all the eatables, living in conFusion!",
            author: "John Lemon"
          },
          {
            rating: 4,
            comment: "Sends anyone to heaven, I wish I could get my mother-in-law to eat it!",
            author: "Paul McVites"
          }
        ]
    }, function (err, dish) {
        if (err) throw err;
        console.log('Dish created!');
        console.log(dish);
        console.log('Readable price is ' + dish.price.toFixed(2)/100);
        var id = dish._id;

        // get all the dishes
        setTimeout(function () {
            Dishes.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, dish) {
                    if (err) throw err;
                    console.log('Updated Dish!');
                    console.log(dish);

                    dish.comments.push({
                        rating: 5,
                        comment: 'I\'m getting a sinking feeling!',
                        author: 'Leonardo di Carpaccio'
                    });

                    dish.save(function (err, dish) {
                        console.log('Updated Comments!');
                        console.log(dish);

                        db.collection('dishes').drop(function () {
                          //  db.close();
                        });
                    });
                });
        }, 3000);
    });

    //Promotions Test

    Promotions.create({
        name: 'Weekend Grand Buffet',
        image: "images/buffet.png",
        label: "New",
        price: "19.99",
        description: 'Featuring . . .',
    }, function (err, promotion) {
        if (err) throw err;
        console.log('promotion created!');
        console.log(promotion);
        console.log('Readable price is ' + promotion.price.toFixed(2)/100);
        var id = promotion._id;

        // get all the dishes
        setTimeout(function () {
            Promotions.findByIdAndUpdate(id, {
                    $set: {
                        label: 'Updated label'
                    }
                }, {
                    new: true
                })
                .exec(function (err, promotion) {
                    if (err) throw err;
                    console.log('Updated promotion!');
                    promotion.save(function (err, promotion) {
                        console.log(promotion);

                        db.collection('promotions').drop(function () {

                        });
                    });
                });
        }, 3000);
    });

    // Leadership test
    Leadership.create({
        name: 'Peter Pan',
        image: "images/alberto.png",
        designation: "Chief Epicurious Officer",
        abbr: "CEO",
        description: 'Our CEO, Peter, . . .',
    }, function (err, leader) {
        if (err) throw err;
        console.log('leader created!');
        console.log(leader);
        var id = leader._id;

        // get all the dishes
        setTimeout(function () {
            Leadership.findByIdAndUpdate(id, {
                    $set: {
                        abbr: 'Updated abbr CEO'
                    }
                }, {
                    new: true
                })
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log('Updated leader!');
                    leader.save(function (err, leader) {
                        console.log(leader);

                        db.collection('leaders').drop(function () {

                        });
                    });
                });
        }, 3000);
    });

    // close db connetction after some time
    setTimeout(function () {
      db.close();
    }, 10000);
});
