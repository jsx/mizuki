
import "test-case.jsx";
import "../lib/mizuki/utility.jsx";

class Pair.<K,V> {
    var key   : K;
    var value : V;

    function constructor(k : K, v : V) {
        this.key   = k;
        this.value = v;
    }
}

class _Test extends TestCase {

    function testSmoke() : void {
        var a = ["aaa", "ccc", "bbb"];

        var r = ArrayUtil.<string>.sort(a, function (x, y) {
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return  1;
            }
            else {
                return 0;
            }
        });
        this.expect(a, "sort() doesn't change the original array")
            .toEqual(["aaa", "ccc", "bbb"]);
        this.expect(r, "sort").toEqual(["aaa", "bbb", "ccc"]);

        r = ArrayUtil.<string>.sort(a, function (x, y) {
            if (x < y) {
                return  1;
            }
            if (x > y) {
                return -1;
            }
            else {
                return 0;
            }
        });
        this.expect(r, "reversed sort").toEqual(["ccc", "bbb", "aaa"]);
    }

    static function genArray(n : int) : number[] {
        return ArrayUtil.<number>.make(n, (i) -> (i+1) * 10);
    }

    function testN31() : void {
        var x = _Test.genArray(31);

        var a = _Test.genArray(31);
        var c = function (a : Nullable.<number>, b : Nullable.<number>) : int {
            return a - b;
        };

        ArrayUtil.<number>.reverseInPlace(a);
        ArrayUtil.<number>.sortInPlace(a, c);
        this.expect(a).toEqual(x);

        ArrayUtil.<number>.reverseInPlace(a, 0, 20);
        ArrayUtil.<number>.sortInPlace(a, c);
        this.expect(a).toEqual(x);
    }

    function testN32() : void {
        var x = _Test.genArray(32);

        var a = _Test.genArray(32);

        ArrayUtil.<number>.reverseInPlace(a);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);

        ArrayUtil.<number>.reverseInPlace(a,  0, 20);
        ArrayUtil.<number>.reverseInPlace(a,  5, 25);
        ArrayUtil.<number>.reverseInPlace(a, 10, 30);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);
    }

    function testN32_x2() : void {
        var N = 32;

        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort((left, right) -> left - right);

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        ArrayUtil.<number>.reverseInPlace(a, 0, a.length);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);

        ArrayUtil.<number>.reverseInPlace(a,  0, 20);
        ArrayUtil.<number>.reverseInPlace(a,  5, 25);
        ArrayUtil.<number>.reverseInPlace(a, 10, 30);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);
    }

    function testN200() : void {
        var N = 200;

        var x = _Test.genArray(N);

        var a = _Test.genArray(N);

        // for sorted array
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);

        // for reversed array
        ArrayUtil.<number>.reverseInPlace(a);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);

        // for partially shuffuled array
        ArrayUtil.<number>.reverseInPlace(a, 100, 120);
        ArrayUtil.<number>.reverseInPlace(a, 110, 130);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);
    }

    function testN500_x2() : void {
        var N = 500;

        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> x - y );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        // for sorted array
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);

        // for reversed array
        ArrayUtil.<number>.reverseInPlace(a, 0, a.length);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);

        // for shuffuled array
        ArrayUtil.<number>.reverseInPlace(a,   0,  20);
        ArrayUtil.<number>.reverseInPlace(a,  10,  30);
        ArrayUtil.<number>.reverseInPlace(a, 100, 120);
        ArrayUtil.<number>.reverseInPlace(a, 110, 130);
        ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(a).toEqual(x);
    }

    function testShuffled() : void {
        var N = 1000;
        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> x - y );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        for (var i = 0; i < 100; ++i) {
            ArrayUtil.<number>.shuffleInPlace(a);
            ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
            this.expect(a).toEqual(x);
        }
    }

    function testHalfShuffled() : void {
        var N = 1000;
        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> x - y );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        for (var i = 0; i < 100; ++i) {
            ArrayUtil.<number>.shuffleInPlace(a, 0, a.length >> 1);
            ArrayUtil.<number>.sortInPlace(a, (x, y) -> x - y);
            this.expect(a).toEqual(x);
        }
    }

    function testHalfShuffledRev() : void {
        var N = 1000;
        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> y - x );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        for (var i = 0; i < 100; ++i) {
            ArrayUtil.<number>.shuffleInPlace(a, 0, a.length >> 1);
            ArrayUtil.<number>.sortInPlace(a, (x, y) -> y - x);
            this.expect(a).toEqual(x);
        }
    }

    function testCopied() : void {
        var x = [30, 20, 10];
        var a = ArrayUtil.<number>.sort(x, (x, y) -> x - y);

        this.expect(a, "a is sorted").toEqual([10, 20, 30]);
        this.expect(x, "x is not changed").toEqual([30, 20, 10]);
    }

    function testStabilityForSmallArray() : void {
        var a = [
            new Pair.<int, int>(30, 100),
            new Pair.<int, int>(30, 110),
            new Pair.<int, int>(30, 120),
            new Pair.<int, int>(20, 100),
            new Pair.<int, int>(20, 110),
            new Pair.<int, int>(20, 120),
            new Pair.<int, int>(10, 100),
            new Pair.<int, int>(10, 110),
            new Pair.<int, int>(10, 120)
        ];

        ArrayUtil.<Pair.<int,int>>.sortInPlace(a, (a,b) -> {
            return a.key - b.key; // sort by key
        });

        a.reduce.<Pair.<int, int>>((previous, current) -> {
            if (previous.key == current.key) {
                this.expect(previous.value).toBeLE(current.value);
            }

            return current;
        });
    }

    function testStabilityForLargeArray() : void {
        var a = ArrayUtil.<Pair.<int, int>>.make(1000, function (i) {
            return new Pair.<int, int>((Math.random() * 11) as int, i);
        });

        ArrayUtil.<Pair.<int,int>>.sortInPlace(a, (a,b) -> {
            return a.key - b.key; // sort by key
        });

        a.reduce.<Pair.<int, int>>((previous, current) -> {
            if (previous.key == current.key) {
                this.expect(previous.value, "key:" + previous.key as string).toBeLE(current.value);
            }

            return current;
        });
    }
}

// set vim: expandtab:
