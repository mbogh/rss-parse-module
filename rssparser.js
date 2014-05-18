(function() {

    var _yahooPipeUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=2FV68p9G3BGVbc7IdLq02Q&_render=json&feedcount=100&feedurl=';
    var _rssFeedUrl = '';
    var _objectClass;
    var _successCallback;
    var _errorCallback;
    var _processItemCallback;

    var parseJSON = function(jsonString) {
        var promises = [];
        var json = JSON.parse(jsonString);
        var items = json['value']['items'];
        for (var i = 0; i < items.length; i++) {
            var itemDictionary = items[i];
            promises.push(createOrUpdateItem(itemDictionary));
        };

        return Parse.Promise.when(promises);
    };

    var createOrUpdateItem = function(itemDictionary) {
        var promise = new Parse.Promise();
        var link = itemDictionary['link'];
        var n = link.lastIndexOf("/Arkiv-") + 1;
        var uuid = link.slice(n);
        uuid = uuid.replace('.aspx', '').replace('/', '-').toLowerCase();
        
        console.log(incidentDictionary['title'] + ' ' + uuid);
        
        var query = new Parse.Query(IncidentClass);
        query.equalTo("uuid", uuid);
        query.first().then(function(object) {
            console.log('first');
            var incidentObject = object;
            if (incidentObject === undefined) {
                incidentObject = new IncidentClass();
                console.log('new incident');
            }
            incidentObject.set('title', incidentDictionary['title']);
            incidentObject.set('url', incidentDictionary['link']);
            incidentObject.set('uuid', uuid);
            incidentObject.set('publishedAt', new Date(incidentDictionary['pubDate']));
            console.log('incident: ' + incidentObject.get('title'));
            incidentObject.save().then(function() {
                promise.resolve();
            });
        });
        return promise;
    };

    module.exports = {
        initialize: function(feedUrl, className) {
            _rssFeedUrl = encodeURIComponent(feedUrl);
            _objectClass = Parse.Object.extend(className);
            return this;
        },
        parse: function(success, error, processItem) {
            _successCallback = success;
            _errorCallback = error;
            _processItemCallback = processItem;

            Parse.Cloud.httpRequest({
                url: _yahooPipeUrl + _rssFeedUrl,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                success: function(httpResponse) {
                    parseJSON(httpResponse.text).then(function() {
                        _successCallback();
                    });
                },
                error: function(httpResponse) {
                    _errorCallback(httpResponse);
                }
            });
        }
    }
})();