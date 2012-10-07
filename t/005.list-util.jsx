import "test-case.jsx";
import "../lib/mizuki/utility.jsx";

class _Test extends TestCase {

    function testCopyForward() : void {
        var a = [
            1,
            2, // destPos
            3, // srcPos
            4,
            5
        ];
        ListUtil.<number>.copyForward(a, 2, a, 1, 2);
        this.expect(a).toEqual([1, 3, 4, 4, 5]);
    }

	function testCopyBackward() : void {
        var a = [
            1,
            2, // srcPos
            3, // destPos
            4,
            5
        ];
        ListUtil.<number>.copyBackward(a, 1, a, 2, 2);
        this.expect(a, "copyBackward").
            toEqual([1, 2, 2, 3, 5]);
    }

    static function numCmp(a : Nullable.<number>, b : Nullable.<number>) : int {
        return a - b;
    }

    function testLowerBound() : void {
        var a = [10, 20, 20, 30, 30, 30, 40];

        [10, 20, 30, 40].forEach((item) -> {
            var index = ListUtil.<number>.lowerBound(a, 0, a.length, item, _Test.numCmp);
            this.expect(index, "lowerBound for " + item as string).toBe(a.indexOf(item));
        });

        this.expect(ListUtil.<number>.lowerBound(a, 0, a.length, 0, _Test.numCmp), "for less than the first item").toBe(0);
        this.expect(ListUtil.<number>.lowerBound(a, 0, a.length, 50, _Test.numCmp), "for grater than the last item").toBe(a.length);
    }

    function testUpperBound() : void {
        var a = [10, 20, 20, 30, 30, 30, 40];

        [10, 20, 30, 40].forEach((item) -> {
            var index = ListUtil.<number>.upperBound(a, 0, a.length, item, _Test.numCmp);
            this.expect(index, "upperBound for " + item as string).toBe(a.lastIndexOf(item)+1);
        });

        this.expect(ListUtil.<number>.upperBound(a, 0, a.length, 0, _Test.numCmp), "for less than the first item").toBe(0);
        this.expect(ListUtil.<number>.upperBound(a, 0, a.length, 50, _Test.numCmp), "for grater than the last item").toBe(a.length);
    }

    function testShuffle() : void {
        var a = [1, 2, 3];

        a = ListUtil.<number>.shuffle(a);
        ListUtil.<number>.shuffleInPlace(a, 0, 0);

        for (var i = 0; i < 100; ++i) {
            ListUtil.<number>.shuffleInPlace(a);
            this.expect(a.length).toBe(3);
        }
    }

    function testMaker() : void {
        var a = ListUtil.<number>.make(5, (i) -> i + 1);
        this.expect(a).toEqual([1, 2, 3, 4, 5]);

        var b = ListUtil.<string>.make(5, (i) -> i as string);
        this.expect(b).toEqual(["0", "1", "2", "3", "4"]);
    }

    function testZip() : void {
        var a = ListUtil.<number>.zip([1, 2, 3], [10, 20, 30]);
        this.expect(a).toEqual([ [1, 10], [2, 20], [3, 30] ] : Array.<variant>);
    }

    function testEquals() : void {
        var a = [10, 20, 30];

        this.expect(ListUtil.<number>.equals(a, a)).toBe(true);
        this.expect(ListUtil.<number>.equals(a, [10,20,30])).toBe(true);

        this.expect(ListUtil.<number>.equals(a, []:number[])).toBe(false);
        this.expect(ListUtil.<number>.equals(a, [10,20,31])).toBe(false);
    }
}

// vim: set expandtab:
