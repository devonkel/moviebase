'use strict';

var Movie = require('../models/movies');


module.exports = function (router) {

    var model = new Movie();

    router.get('/', function (req, res) {
        Movie.find({}, function(err, movies){
            if(err){
                res.send(err);
            } else {
                var model = {
                    movies: movies
                }
                res.render('movies', model);
            }
        });
    });
    
    router.get('/add', function (req,res) {
       res.render('addmovies'); 
    });
    
    router.get('/details/:id', function (req, res) {
        Movie.findOne({_id: req.params.id}, function (err, movie){
            if(err){
                res.send(err);
            } else {
                var model = {
                    movie: movie
                }
                res.render('details', model);
            }
        });
    });
    
    router.get('/edit/:id', function(req, res){
       Movie.findOne({_id: req.params.id}, function (err, movie){
          if (err) {
              res.send(err);
          } else {
              var model = {
                  movie: movie
              }
              res.render('editmovie', model);
          }
       }); 
    });
    
    router.post('/search', function(req, res){
        console.log('Searching ...');
        Movie.search(req.body.searchText, {title: 1, plot: 1, cover: 1}, {
            conditions: {title: {$exists: true}, plot: {$exists: true}, cover: {$exists: true}},
            sort: {title: 1},
            limit: 10
        }, function(err, movies){
            if(err){
                res.send(err);
            } else {
                var model = {movies: movies.results};
                res.render('movies', model);
            }
        });
    });
    
    router.post('/add', function (req, res){
        var title = req.body.title && req.body.title.trim();
        var rating = req.body.rating && req.body.rating.trim();
        var genre = req.body.genre && req.body.genre.trim();
        var plot = req.body.plot && req.body.plot.trim();
        var release_date = req.body.release_date && req.body.release_date.trim();
        var director = req.body.director && req.body.director.trim();
        var trailer = req.body.trailer && req.body.trailer.trim();
        var cover = req.body.cover && req.body.cover.trim();
        
        if (title == '' || release_date == ''){
            req.flash('error', "Please fill out required(*) fields.");
            res.location('/movies/add');
            res.redirect('/movies/add');
        } else {
        
            var newMovie = new Movie({
                title: title,
                rating: rating,
                genre: genre,
                plot: plot,
                release_date: release_date,
                director: director,
                trailer: trailer,
                cover: cover
            });

            newMovie.save(function (err){
                if (err){
                    res.send(err);
                } else {
                    req.flash('success',"Movie added.");
                    res.location('/movies');
                    res.redirect('/movies');                
                }
            });
        }
    });
    
    router.post('/edit/:id', function (req, res){
        var title = req.body.title && req.body.title.trim();
        var rating = req.body.rating && req.body.rating.trim();
        var genre = req.body.genre && req.body.genre.trim();
        var plot = req.body.plot && req.body.plot.trim();
        var release_date = req.body.release_date && req.body.release_date.trim();
        var director = req.body.director && req.body.director.trim();
        var trailer = req.body.trailer && req.body.trailer.trim();
        var cover = req.body.cover && req.body.cover.trim();
        
        if (title == '' || release_date == ''){
            console.log('ERROR: No title or release_date');
            req.flash('error', "Please fill out required(*) fields.");
            res.location('/movies/edit/'+req.params.id);
            res.redirect('/movies/edit/'+req.params.id);
        } else {
        
            var query = {_id: req.params.id};

            var update = {
                title: title,
                rating: rating,
                genre: genre,
                plot: plot,
                release_date: release_date,
                director: director,
                trailer: trailer,
                cover: cover
            };

            Movie.update(query, update, function (err){
                if (err){
                    res.send(err);
                } else {
                    req.flash('success',"Movie updated.");
                    res.location('/movies');
                    res.redirect('/movies');                
                }
            });
        }
    });
    
    router.delete('/delete/:id', function(req, res){
        var query = {_id: req.params.id};
        
        Movie.remove(query, function(err){
            if (err) {
                res.send(err);
            } else {
                res.status(204).send();
            }
        });
    });
};
