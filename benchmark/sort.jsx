import "../lib/mizuki/utility.jsx";
import "../lib/mizuki/benchmark.jsx";

class _Main {
    static function main(args : string[]) : void {
        var n = args.length > 0 ? args[0] as number : 1000000;

        var b = new Benchmark();
        b.enter("Sorting " + n as string + " of floating point numbers");

        var a = ArrayUtil.<number>.make(n, (i) -> (i+1) * 10 + 0.5);

        for (var i = 0; i < 4; ++i) {
            var u = (a.length >> i) as int;
            b.enter("shuffled " + (u / n * 100) as string + "% of the array");

            b.timeit("builtin sort", function() : void {
                ArrayUtil.<number>.shuffleInPlace(a, 0, u);
            }, function() : void {
                a = a.sort((x, y) -> x - y);
            });

            b.timeit("StableSort! ", function() : void {
                ArrayUtil.<number>.shuffleInPlace(a, 0, u);
            }, function() : void {
                ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
            });

            b.timeit("StableSort  ", function() : void {
                ArrayUtil.<number>.shuffleInPlace(a, 0, u);
            }, function() : void {
                a = ArrayUtil.<number>.sort(a, (x, y) -> x - y);
            });

            b.leave();
        }

        b.leave();
    }
}

// set vim: expandtab:
