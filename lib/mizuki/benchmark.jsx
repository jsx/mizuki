import "console.jsx";

import "./utility.jsx";

/**
 * Manages benchmark sessions.
 *
 * @see <code>benchmark/*.jsx</code> in the distribution.
 */
class Benchmark {
    function log(message : string) : void {
        console.log(StringUtil.repeat(" ", 2 * this.level) + message);
    }

    var level = 0;

    function session(title : string, block : ()->void) : void {
        try {
            this.enter(title);
            block();
        }
        finally {
            this.leave();
        }
    }

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
        if (n >= 10.0) { // for large number
            return NumberUtil.format(n, 0, w);
        }
        else { // for fraction number
            return NumberUtil.format(n, w - 2);
        }
    }

    var leastElapsed = 1000;

    var firstTimeStack = [-1] : number[];

    function timeit(title : string, block : () -> void) : void {
        this.timeit(title, () -> { }, block);
    }

    function timeit(title : string, prepare : () -> void, block : () -> void) : void {
        var count = 0;

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
