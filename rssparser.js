(function() {

    var _yahooPipeUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=2FV68p9G3BGVbc7IdLq02Q&_render=json&feedcount=100&feedurl=';
    var _rssFeedUrl = '';
    var _objectClass;
    var _success;
    var _error;
    var _map;

    var processJSON = function(jsonString) {
        var promises = [];
        var json = JSON.parse(jsonString);
        var items = json['value']['items'];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            promises.push(createOrUpdateItem(item));
        };

        return Parse.Promise.when(promises);
    };

    var createOrUpdateItem = function(item) {
        var promise = new Parse.Promise();
        var properties = _map(item);
        var query = new Parse.Query(_objectClass);
        var uniqueIdentifierKey = getFirstKeyOfArray(properties);
        query.equalTo(uniqueIdentifierKey, properties[uniqueIdentifierKey]);
        query.first().then(function(object) {
            if (object === undefined) {
                object = new _objectClass();
            }

            for (var key in properties) {
                var property = properties[key];
                object.set(key, property);
            }
            object.save().then(function() {
                promise.resolve();
            });
        });
        return promise;
    };

    var getFirstKeyOfArray = function (data) {
        for (var key in data) {
            return key;
        }
    }

    module.exports = {
        initialize: function(feedUrl, className) {
            _rssFeedUrl = encodeURIComponent(feedUrl);
            _objectClass = Parse.Object.extend(className);
            return this;
        },
        parse: function(success, error, map) {
            _success = success;
            _error = error;
            _map = map;

            Parse.Cloud.httpRequest({
                url: _yahooPipeUrl + _rssFeedUrl,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                success: function(httpResponse) {
                    processJSON(httpResponse.text).then(function() {
                        _success();
                    });
                },
                error: function(httpResponse) {
                    _error(httpResponse);
                }
            });
        },
        version: '1.0.0'
    }
})();