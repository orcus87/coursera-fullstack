var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes-1');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    var newDish = Dishes({
        name: 'Uthapizza111',
        description: 'Test'
    });

    newDish.save(function (err) {
        if (err) throw err;
        console.log('Dish created!');

        Dishes.find({}, function (err, dishes) {
            if (err) throw err;

            console.log(dishes);
                        db.collection('dishes').drop(function () {

                db.collection('promotions').drop(function () {
                  db.collection('leaders').drop(function () {
                     db.close();
                  });

                });
            });
        });
    });
});
