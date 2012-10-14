import "../lib/mizuki/collection.jsx";
import "test-case.jsx";

class _Test extends TestCase {
	function testSet() : void {
		var set = new Set.<number>([
			10,
			30,
			30,
			20
		], (a, b) -> a - b);

		this.expect(set.size(), "size").toBe(3);

		this.expect(set.contains( 0)).toBe(false);
		this.expect(set.contains(10)).toBe(true);
		this.expect(set.contains(20)).toBe(true);
		this.expect(set.contains(30)).toBe(true);
		this.expect(set.contains(40)).toBe(false);

		this.expect(set.toArray(), "toArray").toEqual([10, 20, 30]);
	}


	function testClone() : void {
		var set = new Set.<number>([
			10,
			30,
			30,
			20
		], (a, b) -> a - b);

		var set2 = set.clone();

		set.insert(40);

		this.expect(set2.contains(40)).toBe(false);
	}

	function testUnion() : void {
		var cmp = (a : Nullable.<number>, b : Nullable.<number>) : int -> a - b;
		var a = new Set.<number>([1, 2, 3, 4, 5], cmp);
		var b = new Set.<number>([4, 5, 6, 7, 8], cmp);

		this.expect(a.union(b).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		this.expect(b.union(a).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
	}

	function testIntersection() : void {
		var cmp = (a : Nullable.<number>, b : Nullable.<number>) : int -> a - b;
		var a = new Set.<number>([1, 2, 3, 4, 5], cmp);
		var b = new Set.<number>([4, 5, 6, 7, 8], cmp);

		this.expect(a.intersection(b).toArray()).toEqual([4, 5]);
		this.expect(b.intersection(a).toArray()).toEqual([4, 5]);
	}

	function testDifferencee() : void {
		var cmp = (a : Nullable.<number>, b : Nullable.<number>) : int -> a - b;
		var a = new Set.<number>([1, 2, 3, 4, 5], cmp);
		var b = new Set.<number>([4, 5, 6, 7, 8], cmp);

		this.expect(a.difference(b).toArray()).toEqual([1, 2, 3]);
		this.expect(b.difference(a).toArray()).toEqual([6, 7, 8]);
	}


	function testMutableSet() : void {
		var set = new Set.<number>([
			10,
			30,
			30,
			20
		], (a, b) -> a - b);

		this.expect(set.size(), "size").toBe(3);

		set.insert(40);

		this.expect(set.contains( 0)).toBe(false);
		this.expect(set.contains(10)).toBe(true);
		this.expect(set.contains(20)).toBe(true);
		this.expect(set.contains(30)).toBe(true);
		this.expect(set.contains(40)).toBe(true);

		set.remove(20);

		this.expect(set.contains( 0)).toBe(false);
		this.expect(set.contains(10)).toBe(true);
		this.expect(set.contains(20)).toBe(false);
		this.expect(set.contains(30)).toBe(true);
		this.expect(set.contains(40)).toBe(true);

		this.expect(set.toArray(), "toArray").toEqual([10, 30, 40]);

		set.clear();

		this.expect(set.size(), "clear").toBe(0);
	}

	function testRemove() : void {
		var set = new Set.<number>([
			10,
			30,
			30,
			20
		], (a, b) -> a - b);

		set.remove([20, 30]);
		this.expect(set.toArray()).toEqual([10]);

		set.remove(11);
		this.expect(set.toArray()).toEqual([10]);
	}

	function testInsert() : void {
		var set = new Set.<number>([
			10,
			30,
			30,
			20
		], (a, b) -> a - b);

		set.insert([21, 31]);
		this.expect(set.toArray()).toEqual([10, 20, 21, 30, 31]);

		set.insert(10);
		this.expect(set.toArray()).toEqual([10, 20, 21, 30, 31]);
	}
}
