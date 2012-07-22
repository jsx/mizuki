import "console.jsx";

import "./utility.jsx";

class Benchmark {
    function log(message : string) : void {
        console.log(StringUtil.repeat(" ", 2 * this.level) + message);
    }

    var level = 0;

    function enter(title : string) : void {
        this.log(title);

        this.firstTimeStack.push(-1);
        ++this.level;
    }
    function leave() : void {
        this.firstTimeStack.pop();
        --this.level;
    }


    function w(n : number, w : int) : string {
        var i = n as int;
        var f = n - i;

        if (n >= 10.0) { // for large number
            var s = (n as int) as string;
            while (s.length < w) {
                s = " " + s;
            }
            return s;
        }
        else { // for fraction number
            var fs = f as string;
            var p = 2;
            var s = i as string + "." + fs.charAt(p);
            while (s.length < w) {
                s += fs.charAt(++p) ?: "0";
            }
            return s;
        }
    }

    var leastElapsed = 1000;

    var firstTimeStack = [-1] : number[];

    function timeit(title : string, block : () -> void) : void {
        this.timeit(title, () -> { }, block);
    }

    function timeit(title : string, prepare : () -> void, block : () -> void) : void {
        var count = 0;

        var start   = Date.now();
        var elapsed = 0;
        do {
            ++count;
            prepare();

            var t0 = Date.now();
            block();

            elapsed += Date.now() - t0;
        } while (elapsed <= this.leastElapsed);

        elapsed /= count;

        if (this.firstTimeStack[this.level] == -1) {
            this.firstTimeStack[this.level] = elapsed;
            this.log(title + ": " + this.w(elapsed, 6)  + "[ms]");
        }
        else {
            var compareWithFirstTime = (this.firstTimeStack[this.level] / elapsed) * 100;
            this.log(title + ": " + this.w(elapsed, 6)  + "[ms]" +
                    " (" + this.w(compareWithFirstTime , 3) + "%)");
        }
    }
}
// vim: set expandtab:
