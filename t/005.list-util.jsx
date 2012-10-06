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
        this.expect(JSON.stringify(a), "copyForward").
            toBe(JSON.stringify([1, 3, 4, 4, 5]));
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
        this.expect(JSON.stringify(a), "copyBackward").
            toBe(JSON.stringify([1, 2, 2, 3, 5]));
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
        this.expect(JSON.stringify(a)).toBe(JSON.stringify([1, 2, 3, 4, 5]));

        var b = ListUtil.<string>.make(5, (i) -> i as string);
        this.expect(JSON.stringify(b)).toBe(JSON.stringify(["0", "1", "2", "3", "4"]));
    }

    function testZip() : void {
        var a = ListUtil.<number>.zip([1, 2, 3], [10, 20, 30]);
        this.expect(JSON.stringify(a)).toBe(JSON.stringify([ [1, 10], [2, 20], [3, 30] ]));
    }
}

// vim: set expandtab:
