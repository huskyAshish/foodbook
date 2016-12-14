module.exports = function (app, models) {

    var UserModel = models.userModel;

    var bcrypt = require("bcrypt-nodejs");
    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    var facebookConfig = {
        clientID     : process.env.PROJECT_FACEBOOK_CLIENT_ID,
        clientSecret : process.env.PROJECT_FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.PROJECT_FACEBOOK_CALLBACK_URL
    };

    var googleConfig = {
        clientID        : process.env.PROJECT_GOOGLE_CLIENT_ID,
        clientSecret    : process.env.PROJECT_GOOGLE_CLIENT_SECRET,
        callbackURL     : process.env.PROJECT_GOOGLE_CALLBACK_URL
    };

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var mime = require('mime');
    var multer = require('multer');

    // Saving image with extension
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/foodbook-client/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({ storage: storage });

    app.post('/api/foodbook/login', passport.authenticate('local'), login);
    app.post('/api/foodbook/logout', logout);
    app.post('/api/foodbook/loggedin', loggedin);
    app.post ('/api/foodbook/register', register);
    app.get('/api/foodbook/user', findUser);
    app.post('/api/foodbook/user', createUser);
    app.get('/api/foodbook/user/:uid', findUserById);
    app.put('/api/foodbook/user/:uid', updateUser);
    app.delete('/api/foodbook/user/:uid', deleteUser);
    app.post ('/api/foodbook/user/upload', upload.single('myFile'), uploadImage);

    app.post("/api/foodbook/user/:userId/fav/new",addFavoriteRestaurant);
    app.get("/api/foodbook/user/:userId/fav",findAllFavoritesForUser);
    app.delete("/api/foodbook/user/:userId/fav/:restaurantId",removeFavoriteRestaurant);
    
    app.post("/api/foodbook/user/:userId/community", addFollowing);
    app.get("/api/foodbook/user/:userId/following", findFollowing);
    app.get("/api/foodbook/user/:userId/followers", findFollowers);
    app.delete("/api/foodbook/user/:userId/following/:followingId", removeFollowing);
    app.get("/api/foodbook/user/:userId/community", findSuggestedUsers);

    app.get('/foodbook/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/foodbook/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/#/login' }),
        function (req, res) {
            if (req.authInfo.new) {
                res.redirect('/#/user/edit');
            } else {
                res.redirect('/#/user/' + req.user._id);
            }
        });

    app.get('/foodbook/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/foodbook/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/#/login' }),
        function (req, res) {
            if (req.authInfo.new) {
                res.redirect('/#/user/edit');
            } else {
                res.redirect('/#/user/' + req.user._id);
            }
        }
    );
    app.get('/api/foodbook/admin/search', findUsersByKey);


    function localStrategy(username, password, done) {
        UserModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (error) {
                    return done(error);
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        UserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        UserModel
            .findUserByUsername(user.username)
            .then(
                function(success){
                    if(success){
                        res.status(400).send("User exists");
                    }else{
                        UserModel
                            .createUser(user)
                            .then(
                                function (user){
                                    if(user){
                                        req.login(user, function(err) {
                                            if(err) {
                                                res.status(400).send(err);
                                            } else {
                                                res.json(user);
                                            }
                                        });
                                    }
                                },
                                function (err) {
                                    res.status(400).send(err);
                                }
                            );
                    }
                }
            );


    }

    function facebookStrategy(token, refreshToken, profile, done) {
        UserModel
            .findUserByFacebookId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user, {new: false});
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            username: names[0],
                            lastName:  names[1],
                            firstName: names[0],
                            email:     profile.emails ? profile.emails[0].value : "",
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return UserModel
                            .createUser(newFacebookUser)
                            .then(
                                function (user) {
                                    return done(null, user, {new: true});
                                },
                                function (err) {
                                    return done(err);
                                }
                            )
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        UserModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user, {new: false});
                    } else {
                        var newGoogleUser = {
                            username: profile.name.givenName,
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            email: profile.emails[0].value,
                            google: {
                                id:          profile.id,
                                token:       token
                            }
                        };
                        return UserModel
                            .createUser(newGoogleUser)
                            .then(
                                function (user) {
                                    return done(null, user, {new: true});
                                },
                                function (err) {
                                    return done(err);
                                }
                            );
                    }
                },
                function(err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function createUser(req, res) {
        var user = req.body;
        UserModel
            .createUser(user)
            .then(
                function (user) {
                    res.send(user);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }

            )
    }

    function findUser(req, res) {
        var query = req.query;
        if(query.password && query.username){
            findUserByCredentials(req, res);
        }else if(query.username) {
            findUserByUsername(req, res);
        } else {
            console.log(req.user);
            res.json(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        UserModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.send(user);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            )
    }

    function findUsersByKey(req, res) {
        var usernamekey = req.query.usernamekey;

        UserModel
            .findUsersByKey(usernamekey)
            .then(
                function (users) {
                    res.send(users);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        UserModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    res.send(user);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            )
    }

    function findUserById(req, res) {
        var userId = req.params.uid;

        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    res.send(user);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            )
    }

    function  updateUser(req, res) {
        var userId = req.params.uid;
        var newUser = req.body;

        UserModel
            .updateUser(userId, newUser)
            .then(
                function (data) {
                    res.sendStatus(200).send(data);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )

    }

    function  deleteUser(req, res) {
        var userId = req.params.uid;

        UserModel
            .deleteUser(userId)
            .then(
                function (data) {
                    res.sendStatus(200).send(data);
                },
                function (error) {
                    res.statusCode(400).send(error);
                }
            )
    }

    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var myFile        = req.file;

        if (!myFile) {
            res.redirect("/#/user/");
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var url = "/uploads/" + filename;

        var user = {};
        user._id = userId;
        // user._name = originalname;
        user.profile_pic_url = url;

        models
            .userModel
            .updateUser(userId, user)
            .then(function (status) {
                    res.redirect("/#/user/edit");
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function addFavoriteRestaurant(req, res) {
        var userId = req.params.userId;
        var _restaurant = req.body;

        models
            .restaurantModel
            .findRestaurantById(_restaurant._id)
            .then(
                function (restaurant) {
                    if (!restaurant) {
                        models
                            .restaurantModel
                            .createRestaurant(_restaurant)
                            .then(
                                function (newRestaurant) {
                                    models
                                        .userModel
                                        .addFavoriteRestaurant(userId, newRestaurant)
                                        .then(
                                            function (user) {
                                                res.send(user);
                                                return;
                                            },
                                            function (error) {
                                                res.sendStatus(400).send(error);
                                                console.log(error);
                                            }
                                        );
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                    console.log(error);
                                }
                            )
                    } else {
                        models
                            .userModel
                            .addFavoriteRestaurant(userId, _restaurant)
                            .then(
                                function (user) {
                                    res.send(user);
                                    return;
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                    console.log(error);
                }
            );
    }

    function findAllFavoritesForUser(req, res) {
        var userId = req.params.userId;
        models
            .userModel
            .findAllFavoritesForUser(userId)
            .then(
                function (user) {
                    res.send(user.favorites);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function removeFavoriteRestaurant(req, res) {
        var restaurantId = req.params.restaurantId;
        var userId = req.params.userId;
        models
            .userModel
            .removeFavoriteRestaurant(userId, restaurantId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function addFollowing(req, res) {
        var following = req.body;
        var userId = req.params.userId;
        models
            .userModel
            .addFollowing(userId, following)
            .then(
                function (user) {
                    res.send(user);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findFollowing(req, res) {
        var userId = req.params.userId;
        models
            .userModel
            .findFollowing(userId)
            .then(
                function (user) {
                    res.send(user.following);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }
    
    function removeFollowing(req, res) {
        var followingId = req.params.followingId;
        var userId = req.params.userId;
        models
            .userModel
            .removeFollowing(userId, followingId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findFollowers(req, res) {
        var userId = req.params.userId;
        models
            .userModel
            .findFollowers(userId)
            .then(
                function (followers) {
                    res.send(followers);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }
    
    function findSuggestedUsers(req, res) {
        var userId = req.params.userId;
        models
            .userModel
            .findSuggestedUsers(userId)
            .then(
                function (users) {
                    res.send(users);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }
};