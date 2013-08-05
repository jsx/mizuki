import "test-case.jsx";
import "js/web.jsx";
import "../lib/mizuki/utility.jsx";


class _Test extends TestCase {
	function compile() : void {
		var nodeList = dom.document.querySelectorAll(".foo");

		List.<NodeList, Node>.from(nodeList).forEach((item) -> {
			return true;
		});
	}

	function testForEach() : void {
		var result = new Array.<string>;

		List.<number[], number>.from([1, 2, 3]).forEach((item) -> {
			result.push(item as string);
			return true;
		});

		this.expect(result).toEqual(["1", "2", "3"]);

		result = new Array.<string>;

		List.<number[], number>.from([1, 2, 3]).forEach((item, index) -> {
			result.push(index as string);
			return true;
		});

		this.expect(result).toEqual(["0", "1", "2"]);
	}

	function testToArray() : void {
		var result = List.<number[], number>.from([1, 2, 3]).toArray();
		this.expect(result).toEqual([1, 2, 3]);
	}

}
