RSS Feed Parser for Parse Cloud Code
================

A RSS Feed parser for Parse Cloud Code which is useful if you want the content of a RSS feed to end up in the Parse data store.

Installation
------------

Download the module from [Releases](https://github.com/mbogh/rss-parse-module/releases) (e.g. `rssparser-1.0.0.js`) and place it in your `cloud` directory.

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

### parse()
Takes 3 callback functions as input: `success`, `error` and `map`.  
  * `success`: called when parsing of the RSS feed has completed. Takes no arguments.  
  * `error`: called if something bad happens. Takes a single argument which is an error object/dictionary.  
  * `map`: called for every item in the feed and expects a dictionary returned matching the keys of your Parse object. **IMPORTANT NOTICE:** The "first" item in the return dictionary will be used to lookup an existing object and create/update it accordingly. Please see the **Example** section below.

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

Roadmap
-------

**1.**  
Allow objects as parameters e.g. with `initialize()`  
Alternatively pass an object with `url` and `className` e.g. `parser.initialize({url: 'http://example.com/rss', className: 'Example'});`

**2.**  
Support the use of Promises `parser.parse(map(item){}).then()`

Credits
-------
Morten Bøgh ([@mbogh](http://twitter.com/mbogh))

License
-------
RSS Feed Parser for Parse Cloud Code is released under the MIT license. Please see the LICENSE file for more information
