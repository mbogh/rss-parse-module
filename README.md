RSS Feed Parser for Parse Cloud Code
================

A RSS Feed parser for Parse Cloud Code which is useful if you want the content of a RSS feed to end up in Parse.

Installation
------------

Download the module from Releases (e.g. `rssparser-1.0.0.js`) and place it in your `cloud` directory.

To use the module in your Cloud Code functions, start by requiring it and initializing it with your credentials:

```
var parser = require('cloud/rssparser-1.0.0.js');
parser.initialize('URL', 'CLASS');
parser.parse(success,error,map);
```

Documentation
-------------

### initialize()
Takes an URL and a class name as input e.g `parser.initialize('http://example.com/rss', 'Example');`  
Alternatively pass an object with `url` and `className` e.g. `parser.initialize({url: 'http://example.com/rss', className: 'Example'});`

### parse()
Takes 3 callback functions as input: success, error and map.

Example
-------

```
Parse.Cloud.job("NewsFeed", function(request, status) {
    var parser = require('cloud/rssparser-1.0.0.js');
    parser.initialize('https://news.ycombinator.com/rss', 'News');
    parser.parse(function () {
        status.success('Finished!');
    },
    function(error) {
        status.error('Request failed with error ' + error);
    },
    function(item) {
        var mappedItem = new Array();
        mappedItem['commentsLink'] = item['comments'];
        mappedItem['link'] = item['link'];
        mappedItem['title'] = item['title'];
        return mappedItem;
    });
});
```

Credits
-------
Morten Bøgh ([@mbogh](http://twitter.com/mbogh))

License
-------
