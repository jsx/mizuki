// stable sort implementation
// ported from TimSort@OpenJDK
// http://cr.openjdk.java.net/~martin/webrevs/openjdk7/timsort/raw_files/new/src/share/classes/java/util/TimSort.java

import "test-case.jsx";
import "mizuki/stable-sort.jsx";
import "mizuki/utility.jsx";

class _Test extends TestCase {

    function testUtils() : void {
        this.expect(StableSort.<variant>._mid(0, 5), "_mid").toBe(2);
        this.expect(StableSort.<variant>._mid(1, 6)).toBe(3);
        this.expect(StableSort.<variant>._mid(1, 0xFFFFFFFF)).toBe(2147483648);

        var a = [
            1,
            2, // srcPos
            3, // destPos
            4,
            5
        ];
        StableSort.<number>._copyBackward(a, 1, a, 2, 2);
        this.expect(JSON.stringify(a), "_copyBackward").
            toBe(JSON.stringify([1, 2, 2, 3, 5]));

        a = [
            1,
            2, // destPos
            3, // srcPos
            4,
            5
        ];
        StableSort.<number>._copy(a, 2, a, 1, 2);
        this.expect(JSON.stringify(a), "_copy").
            toBe(JSON.stringify([1, 3, 4, 4, 5]));
    }


    function testSmoke() : void {
        var a = ["aaa", "ccc", "bbb"];

        var r = StableSort.<string>.sort(a, function (x, y) {
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
        this.expect(JSON.stringify(a), "sort() doesn't change the original array")
            .toBe(JSON.stringify(["aaa", "ccc", "bbb"]));
        this.expect(JSON.stringify(r), "sort")
            .toBe(JSON.stringify(["aaa", "bbb", "ccc"]));

        r = StableSort.<string>.sort(a, function (x, y) {
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
        this.expect(JSON.stringify(r), "reversed sort")
            .toBe(JSON.stringify(["ccc", "bbb", "aaa"]));
    }

    static function genArray(n : int) : number[] {
        var a = new number[](n);
        for (var i = 0; i < n; ++i) {
            a[i] = (i+1) * 10;
        }
        return a;
    }

    function testN31() : void {
        var x = _Test.genArray(31);

        var a = _Test.genArray(31);
        var c = function (a : Nullable.<number>, b : Nullable.<number>) : int {
            return a - b;
        };

        StableSort.<number>._reverseRange(a, 0, a.length);
        StableSort.<number>.sortInPlace(a, c);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        StableSort.<number>._reverseRange(a, 0, 20);
        StableSort.<number>.sortInPlace(a, c);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));
    }

    function testN32() : void {
        var x = _Test.genArray(32);

        var a = _Test.genArray(32);

        StableSort.<number>._reverseRange(a, 0, a.length);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        StableSort.<number>._reverseRange(a,  0, 20);
        StableSort.<number>._reverseRange(a,  5, 25);
        StableSort.<number>._reverseRange(a, 10, 30);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));
    }

    function testN32_x2() : void {
        var N = 32;

        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort((left, right) -> left - right);

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        StableSort.<number>._reverseRange(a, 0, a.length);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        StableSort.<number>._reverseRange(a,  0, 20);
        StableSort.<number>._reverseRange(a,  5, 25);
        StableSort.<number>._reverseRange(a, 10, 30);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));
    }

    function testN200() : void {
        var N = 200;

        var x = _Test.genArray(N);

        var a = _Test.genArray(N);

        // for sorted array
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        // for reversed array
        StableSort.<number>._reverseRange(a, 0, a.length);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        // for shuffuled array
        StableSort.<number>._reverseRange(a, 100, 120);
        StableSort.<number>._reverseRange(a, 110, 130);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a, null, 2)).toBe(JSON.stringify(x, null, 2));
    }

    function testN500_x2() : void {
        var N = 500;

        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> x - y );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        // for sorted array
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        // for reversed array
        StableSort.<number>._reverseRange(a, 0, a.length);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify(x));

        // for shuffuled array
        StableSort.<number>._reverseRange(a,   0,  20);
        StableSort.<number>._reverseRange(a,  10,  30);
        StableSort.<number>._reverseRange(a, 100, 120);
        StableSort.<number>._reverseRange(a, 110, 130);
        StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
        this.expect(JSON.stringify(a, null, 2)).toBe(JSON.stringify(x, null, 2));
    }

    function testShuffled() : void {
        var N = 1000;
        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> x - y );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        for (var i = 0; i < 100; ++i) {
            ListUtil.<number>.shuffleInPlace(a);
            StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
            this.expect(JSON.stringify(a, null, 2)).toBe(JSON.stringify(x, null, 2));
        }
    }

    function testHalfShuffled() : void {
        var N = 1000;
        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> x - y );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        for (var i = 0; i < 100; ++i) {
            ListUtil.<number>.shuffleInPlace(a, 0, a.length >> 1);
            StableSort.<number>.sortInPlace(a, (x, y) -> x - y);
            this.expect(JSON.stringify(a, null, 2)).toBe(JSON.stringify(x, null, 2));
        }
    }

    function testHalfShuffledRev() : void {
        var N = 1000;
        var x = _Test.genArray(N).concat(_Test.genArray(N))
            .sort( (x, y) -> y - x );

        var a = _Test.genArray(N).concat(_Test.genArray(N));

        for (var i = 0; i < 100; ++i) {
            ListUtil.<number>.shuffleInPlace(a, 0, a.length >> 1);
            StableSort.<number>.sortInPlace(a, (x, y) -> y - x);
            this.expect(JSON.stringify(a, null, 2)).toBe(JSON.stringify(x, null, 2));
        }
    }

    function testCopied() : void {
        var x = _Test.genArray(3).reverse();
        var a = StableSort.<number>.sort(x, (x, y) -> x - y);

        this.expect(JSON.stringify(x, null, 2), "x is not changed").toBe(JSON.stringify([30, 20, 10], null, 2));
        this.expect(JSON.stringify(a, null, 2), "a is sorted").toBe(JSON.stringify([10, 20, 30], null, 2));
    }
}

// set vim: expandtab:
