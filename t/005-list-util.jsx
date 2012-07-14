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
}
