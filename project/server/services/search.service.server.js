module.exports = function (app, Models) {

    var UserModel = Models.userModel;

    app.get('/api/project/search', searchRestaurants);

    function searchRestaurants(req, res) {
        var cuisine = req.query.cuisine;
        var search_location = req.query.location;
        var keyword = req.query.keyword;
        
        var n = require('nonce')();
        var oauthSignature = require('oauth-signature');
        var request = require('request');
        var qs = require('querystring');

        var method = "GET";
        var url = "http://api.yelp.com/v2/search?";
        var params;

        if (cuisine == undefined || cuisine == null) {
            cuisine = "All"
        }
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

        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
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
                res.statusCode(400).send(error);
                return;
            }
            var data = JSON.parse(body);
                console.log(data)
            //console.log(data.businesses);
            res.send(data.businesses);
            }
        );
    }

};