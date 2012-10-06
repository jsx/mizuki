mizuki [![Build Status](https://secure.travis-ci.org/gfx/mizuki.png)](http://travis-ci.org/gfx/mizuki)
====================

Set of utility libraries for JSX

SYNOPSIS
====================

    // pseudo random generator

   import "random-generator/mt.jsx";

    var r = new MT();
    log r.nextInt32();
    log r.nextUUID(); // RFC-4122 complaint UUID

    // utilities for list, strings and numbers

    import "utility.jsx";
    log ListUtil.sort([...], compareFunction); // stable sort
    log StringUtil.visualWidth("hello");
    log StringUtil.byteLength("hello");
    log NumberUtil.format(3.1415, 2); // "3.14"

    // date/time format

    log DateTime.strftime(new Date(), "%Y-%m-%d %H:%M:%S");
    log DateTime.strptime("2012-12-01", "%Y-%m-%d %H:%M:%S");

DESCRIPTION
====================

Mizuki provides a set of utilities for [JSX](http://jsx.github.com/), which is not a part of JSX language but inevitable.

TODO
====================

DateTime, gettext(), Logger, diff utils

COPYRIGHT AND LICENSE
====================

This library can be distributed under the MIT License unless other licenses are specified in each file.

Copyright (c) 2012 Fuji, Goro (gfx) <gfuji@cpan.org>.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

