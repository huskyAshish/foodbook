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
        var url = "http://api.yelp.com/v2/search?callback=JSON_CALLBACK";
        var params;

        if (cuisine == undefined || cuisine == null)
        {
            cuisine = "";
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
                callback: 'angular.callbacks._0',
                location: search_location,
                limit: 10,
                oauth_consumer_key: process.env.OAUTH_CONSUMER_KEY,
                oauth_token: process.env.OAUTH_TOKEN,
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: n(),
                term: keyword,
            };

        var consumerSecret = process.env.CONSUMER_SECRET;
        var tokenSecret = process.env.TOKEN_SECRET;
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
                var data = JSON.parse(body);
                //console.log(data.businesses);
                res.send(data.businesses);
            }
        );

        /*$http.jsonp(url, {
            params: params
        }).success(function(response) {
            if(response != null) {
                console.log(response);
                if(response.total === 0)
                    res.statusCode(400).send();
                var trimmedResponse = trimResponse(response);
                res.send(trimmedResponse);
            }
        }).error(function(err) {
            res.statusCode(400).send(err);
        });*/
    }

};