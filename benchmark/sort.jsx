import "console.jsx";
import "mizuki/stable-sort.jsx";
import "mizuki/utility.jsx";

class _Main {
    static function genArray(n : int) : number[] {
        var a = new number[](n);
        for (var i = 0; i < n; ++i) {
            a[i] = (i+1) * 10;
        }
        return a;
    }

    static function main(args : string[]) : void {
        var n = args.length > 0 ? args[0] as number : 1000000;

        var a = ListUtil.<number>.make(n, (i) -> (i+1) * 10 + 0.5);

        var w = function (n : number, w : int) : string {
            var s = n as string;
            while (s.length < w) {
                s = " " + s;
            }
            return s;
        };

        for (var i = 0; i < 4; ++i) {
            var u = (a.length >> i) as int;
            console.log("shuffled " + (u / n * 100) as string + "% of the array");

            ListUtil.<number>.shuffleInPlace(a, 0, u);
            var t0 = Date.now();
            a = a.sort((x, y) -> x - y);
            var t1 = Date.now();
            var base = t1 - t0;
            console.log("builtin sort: " + w(base, 4)  + "[ms]");

            ListUtil.<number>.shuffleInPlace(a, 0, u);
            var t0 = Date.now();
            StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
            var t1 = Date.now();
            var e  = t1 - t0;
            console.log("StableSort!:  " + w(e, 4) + "[ms] (" + w(((base / e) * 100) as int, 3) + "%)");

            ListUtil.<number>.shuffleInPlace(a, 0, u);
            var t0 = Date.now();
            a = StableSort.<number>.sort(a, (x, y) -> x - y);
            var t1 = Date.now();
            var e  = t1 - t0;
            console.log("StableSort:   " + w(e, 4) + "[ms] (" + w(((base / e) * 100) as int, 3) + "%)");

        }
    }
}

// set vim: expandtab:
