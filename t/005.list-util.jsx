import "test-case.jsx";
import "mizuki/utility.jsx";

class _Test extends TestCase {
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
}
