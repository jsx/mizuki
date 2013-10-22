mizuki [![Build Status](https://secure.travis-ci.org/gfx/mizuki.png)](http://travis-ci.org/gfx/mizuki)
====================

Set of basic utilities for JSX

SYNOPSIS
====================


import "mizuki/datetime.jsx"
---------------------

    // date/time format

    log DateTime.strftime(new Date(),   "%Y-%m-%d %H:%M:%S.%3N");
    log DateTime.strptime("2012-12-01", "%Y-%m-%d %H:%M:%S.%3N");


import "random-generator/mt.jsx";
---------------------

    // pseudo random generator

    var r = new MT(); // Mersenne Twister generator
    log r.nextInt32();
    log r.nextUUID(); // RFC-4122 complaint UUID

import "utility.jsx";
---------------------

    // utilities for arrays, strings and numbers

    ArrayUtil.<T>.shuffleInPlace(array);
    ArrayUtil.<T>.sortInPlace(array, compareFunction); // stable sort

    log StringUtil.visualWidth("hello");
    log StringUtil.byteLength("hello");
    log StringUtil.charLength("hello");

    log Base64.encode(text);
    log Base64.decode(b64encoded);

    log NumberUtil.format(3.1415, 2); // "3.14"


import "mizuki/collection.jsx";
---------------------

    // Set for any types

    var set = new Set.<number>([1, 2, 3], (a, b) -> a - b);
    set.has(1); // true
    set.has(4); // false

    var u = set.union(otherSet);
    var i = set.intersection(otherSet);
    var d = set.difference(otherSet);

import "mizuki/digest/md5.jsx";
---------------------

    var hex = MD5.hex("value"); // -> 2063c1608d6e0baf80249c42e2be5804

DESCRIPTION
====================

Mizuki provides a set of utilities for [JSX](http://jsx.github.com/), which is not a part of JSX language but inevitable.

PREREQUISITES
====================

The JSX compiler and NodeJS 0.8.0 or later.

COPYRIGHT AND LICENSE
====================

Copyright (c) 2012 Fuji, Goro (gfx) <gfuji@cpan.org>.

This library can be distributed under [the MIT License](LICENSE.md) unless other licenses are specified in each file.

