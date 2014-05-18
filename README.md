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
```

Example
-------

Credits
-------
Morten Bøgh ([@mbogh](http://twitter.com/mbogh))

License
-------
