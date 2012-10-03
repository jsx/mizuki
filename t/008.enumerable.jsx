import "test-case.jsx";
import "js/web.jsx";
import "../lib/mizuki/utility.jsx";


class _Test extends TestCase {
	function compile() : void {
		var nodeList = dom.document.querySelectorAll(".foo");

		Enumerable.<NodeList, Node>.from(nodeList).forEach((item) -> {
			log item;
		});
	}

	function testForEach() : void {
		var result = new Array.<string>;

		Enumerable.<number[], number>.from([1, 2, 3]).forEach((item) -> {
			result.push(item as string);
		});

		this.expect(JSON.stringify(result)).toBe(JSON.stringify(["1", "2", "3"]));
	}

}
