module.exports = function (app, models) {

    app.post('/api/foodbook/restaurant/:restaurantId/review', createReview);
    app.get('/api/foodbook/restaurant/:restaurantId/review', findAllReviewsForRestaurant);
    app.get("/api/foodbook/user/:userId/review", findAllReviewsForUser);
    app.get('/api/foodbook/review/:reviewId', findReviewById);
    app.put('/api/foodbook/review/:reviewId', updateReview);
    app.delete('/api/foodbook/review/:reviewId', deleteReview);

    function createReview(req, res) {

        var restaurantId = req.params.restaurantId;
        var _restaurant = req.body.restaurant;
        var _review = req.body.review;

        models
            .restaurantModel
            .findRestaurantById(restaurantId)
            .then(
                function (restaurant) {
                    if (!restaurant) {
                        models
                            .restaurantModel
                            .createRestaurant(_restaurant)
                            .then(
                                function (newRestaurant) {
                                    models
                                        .reviewModel
                                        .createReview(_review)
                                        .then(
                                            function (review) {
                                                res.send(review);
                                                return;
                                            },
                                            function (error) {
                                                res.sendStatus(400).send(error);
                                            }
                                        );
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            )
                    } else {
                        models
                            .reviewModel
                            .createReview(_review)
                            .then(
                                function (review) {
                                    res.send(review);
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
                }
            );
    }

    function findAllReviewsForRestaurant(req, res) {
        var restaurantId = req.params.restaurantId;

        models
            .reviewModel
            .findAllReviewsForRestaurant(restaurantId)
            .then(
                function (reviews) {
                    res.send(reviews);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            );
    }

    function findAllReviewsForUser(req, res) {
        var userId = req.params.userId;
        models
            .reviewModel
            .findAllReviewsForUser(userId)
            .then(
                function (reviews) {
                    res.send(reviews);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function findReviewById(req, res) {
        var reviewId = req.params.reviewId;

        models
            .reviewModel
            .findReviewById(reviewId)
            .then(
                function (review) {
                    res.send(review);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            )
    }

    function  updateReview(req, res) {
        var reviewId = req.params.reviewId;
        var review = req.body;

        models
            .reviewModel
            .updateReview(reviewId, review)
            .then(
                function (data) {
                    res.sendStatus(200).send(data);
                },
                function (error) {
                    res.sendStatus(500).send(error);
                }
            );
    }

    function  deleteReview(req, res) {
        var reviewId = req.params.uid;

        models
            .reviewModel
            .deleteReview(reviewId)
            .then(
                function (data) {
                    res.sendStatus(200).send(data);
                },
                function (error) {
                    res.statusCode(500).send(error);
                }
            );
    }
};