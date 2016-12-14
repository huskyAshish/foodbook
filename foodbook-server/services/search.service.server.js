module.exports = function (app, Models) {

    var UserModel = Models.userModel;

    app.get('/api/foodbook/search', searchRestaurants);
    app.get('/api/foodbook/search/:restaurantId', searchRestaurantById);

    function searchRestaurantById(req, res) {
        var restaurantId = req.params.restaurantId;
        var n = require('nonce')();
        var oauthSignature = require('oauth-signature');
        var request = require('request');
        var qs = require('querystring');

        var method = "GET";
        var url = "http://api.yelp.com/v2/business/" + restaurantId;
        var params;

        params = {
                oauth_consumer_key: process.env.YELP_OAUTH_CONSUMER_KEY,
                oauth_token: process.env.YELP_OAUTH_TOKEN,
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: n()
            };

        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
            encodeSignature: false
        });

        //put signature in params
        params.oauth_signature = signature;

        var finalUrl = url + '?' + qs.stringify(params);

        console.log(finalUrl);

        request(finalUrl,
            function(error, response, body){
            if (error) {
                res.sendStatus(400).send(error);
                return;
            }
            try {
                var data = JSON.parse(body);
            }
            catch (e) {
                console.log("Not JSON");
                return;
            }
            console.log(body);
            res.send(data);
            }
        );
    }

    function searchRestaurants(req, res) {
        var search_location = req.query.location;
        var keyword = req.query.keyword;

        var n = require('nonce')();
        var oauthSignature = require('oauth-signature');
        var request = require('request');
        var qs = require('querystring');

        var method = "GET";
        var url = "http://api.yelp.com/v2/search?";
        var params;

        if (search_location == undefined || search_location == null)
        {
            search_location = "";
        }
        if (keyword == undefined || keyword == null)
        {
            keyword = "";
        }

        params = {
            location: search_location,
            limit: 20,
            oauth_consumer_key: process.env.YELP_OAUTH_CONSUMER_KEY,
            oauth_token: process.env.YELP_OAUTH_TOKEN,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: new Date().getTime(),
            oauth_nonce: n(),
            term: keyword,
            category_filter: 'restaurants'
        };

        var consumerSecret = process.env.YELP_CONSUMER_SECRET;//;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
            encodeSignature: false
        });

        //put signature in params
        params.oauth_signature = signature;
        var paramUrl = qs.stringify(params);

        var finalUrl = url+'&'+ qs.stringify(params);

        console.log(finalUrl);

        request(finalUrl,
            function(error, response, body){
                if (error) {
                    res.sendStatus(400).send(error);
                    return;
                }
                try {
                    var data = JSON.parse(body);
                }
                catch (e) {
                    console.log("Not JSON");
                    return;
                }
                res.send(data.businesses);
            }
        );
    }

};