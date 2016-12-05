module.exports = function (app, Models) {

    var UserModel = Models.userModel;

    app.get('/api/project/search', searchRestaurants);

    function searchRestaurants(req, res) {
        var cuisine = req.query.cuisine;
        var location = req.query.location;
        var keyword = req.query.keyword;
        var n = require('nonce')();
        var oauthSignature = require('oauth-signature');
        var request = require('request');
        var qs = require('querystring');

        var method = "GET";
        var url = "http://api.yelp.com/v2/search?callback=JSON_CALLBACK";
        var params;

        params = {
            //location: location,
            //limit: 10,
            //category_filter: cuisine,
            oauth_consumer_key: process.env.oauth_consumer_key,
            oauth_token: process.env.oauth_token,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: n().toString().substr(0,10),
            oauth_nonce: n(),
            oauth_version: '1.0',
            //term: keyword,
            location: 'San+Francisco',
            sort: '2'
        };
        var consumerSecret = 'FuU7sJ0dS_ZTNG69McOkuL8sYFU';
        var tokenSecret = 'UVdhhUSqgX2WWLzc2e5by6bfXSM';
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
            encodeSignature: false
        });

        //put signature in params
        params.oauth_signature = signature;

        var paramUrl = qs.stringify(params);

        var finalUrl = url+'?'+paramUrl;

        request(finalUrl,
            function(error, response, body){
                console.log(body);
                res.send(response);
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