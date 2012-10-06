import "test-case.jsx";
import "js/web.jsx";
import "../lib/mizuki/utility.jsx";


class _Test extends TestCase {
	function compile() : void {
		var nodeList = dom.document.querySelectorAll(".foo");

		Enumerable.<NodeList, Node>.from(nodeList).forEach((item) -> {
			return true;
		});
	}

	function testForEach() : void {
		var result = new Array.<string>;

		Enumerable.<number[], number>.from([1, 2, 3]).forEach((item) -> {
			result.push(item as string);
			return true;
		});

		this.expect(JSON.stringify(result)).toBe(JSON.stringify(["1", "2", "3"]));

		result = new Array.<string>;

		Enumerable.<number[], number>.from([1, 2, 3]).forEach((item, index) -> {
			result.push(index as string);
			return true;
		});

		this.expect(JSON.stringify(result)).toBe(JSON.stringify(["0", "1", "2"]));
	}

}
