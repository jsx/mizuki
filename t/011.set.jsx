import "../lib/mizuki/collection.jsx";
import "../lib/mizuki/utility.jsx";
import "test-case.jsx";


class _Test extends TestCase {

    function testContains() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetContains(set);
    }
    function testContainsSS() : void {
        var set = new StringSet;
        this.ISetContains(set);
    }
    function ISetContains(set : ISet.<string>) : void {
        set.insert(["b", "c", "c", "d"]);

        this.expect(set.size(), "size").toBe(3);

        this.expect(set.contains("a")).toBe(false);
        this.expect(set.contains("b")).toBe(true);
        this.expect(set.contains("c")).toBe(true);
        this.expect(set.contains("d")).toBe(true);
        this.expect(set.contains("e")).toBe(false);

        this.expect(set.toArray(), "toArray").toEqual(["b", "c", "d"]);
    }


    function testClone() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetClone(set);
    }
    function testCloneSS() : void {
        var set = new StringSet;
        this.ISetClone(set);
    }
    function ISetClone(set : ISet.<string>) : void {
        set.insert([
            "a",
            "c",
            "c",
            "d"
        ]);

        var set2 = set.clone();

        set.insert("e");

        this.expect(set .contains("e")).toBe(true);
        this.expect(set2.contains("e")).toBe(false);
    }

    function testUnion() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetUnion(set);
    }
    function testUnionSS() : void {
        var set = new StringSet;
        this.ISetUnion(set);
    }
    function ISetUnion(proto : ISet.<string>) : void {
        var a = proto.create(["a", "b", "c", "d", "e"]);
        var b = proto.create(["d", "e", "f", "g", "h"]);

        this.expect(a.union(b).toArray()).toEqual(["a", "b", "c", "d", "e", "f", "g", "h"]);
        this.expect(b.union(a).toArray()).toEqual(["a", "b", "c", "d", "e", "f", "g", "h"]);
    }


    function testIntersection() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetIntersection(set);
    }
    function testIntersectionSS() : void {
        var set = new StringSet;
        this.ISetIntersection(set);
    }
    function ISetIntersection(proto : ISet.<string>) : void {
        var a = proto.create(["a", "b", "c", "d", "e"]);
        var b = proto.create(["d", "e", "f", "g", "h"]);

        this.expect(a.intersection(b).toArray()).toEqual(["d", "e"]);
        this.expect(b.intersection(a).toArray()).toEqual(["d", "e"]);
    }

    function testDifference() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetDifference(set);
    }
    function testDifferenceSS() : void {
        var set = new StringSet;
        this.ISetDifference(set);
    }
    function ISetDifference(proto : ISet.<string>) : void {
        var a = proto.create(["a", "b", "c", "d", "e"]);
        var b = proto.create(["d", "e", "f", "g", "h"]);

        this.expect(a.difference(b).toArray()).toEqual(["a", "b", "c"]);
        this.expect(b.difference(a).toArray()).toEqual(["f", "g", "h"]);
    }

    function testBasicMutator() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetBasicMutator(set);
    }
    function testBasicMutatorSS() : void {
        var set = new StringSet;
        this.ISetBasicMutator(set);
    }
    function ISetBasicMutator(set : ISet.<string>) : void {
        set.insert([
            "b", "c", "c", "d"
        ]);

        this.expect(set.size(), "size").toBe(3);

        set.insert("e");

        this.expect(set.contains("a")).toBe(false);
        this.expect(set.contains("b")).toBe(true);
        this.expect(set.contains("c")).toBe(true);
        this.expect(set.contains("d")).toBe(true);
        this.expect(set.contains("e")).toBe(true);

        set.remove("c");

        this.expect(set.contains("a")).toBe(false);
        this.expect(set.contains("b")).toBe(true);
        this.expect(set.contains("c")).toBe(false);
        this.expect(set.contains("d")).toBe(true);
        this.expect(set.contains("e")).toBe(true);

        this.expect(set.toArray(), "toArray").toEqual(["b", "d", "e"]);

        set.clear();

        this.expect(set.size(), "clear").toBe(0);
        this.expect(set.toArray(), "toArray").toEqual([] : string[]);
    }

    function testInsert() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetInsert(set);
    }
    function testInsertSS() : void {
        var set = new StringSet;
        this.ISetInsert(set);
    }
    function ISetInsert(set : ISet.<string>) : void {
        set.insert(["b", "c", "c", "d"]);

        set.insert(["cc", "dd"]);
        this.expect(set.toArray()).toEqual(["b", "c", "cc", "d", "dd"]);

        set.insert("b");
        this.expect(set.toArray()).toEqual(["b", "c", "cc", "d", "dd"]);

        set.insert("a");
        this.expect(set.toArray()).toEqual(["a", "b", "c", "cc", "d", "dd"]);
    }

    function testRemove() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compare(a, b) );
        this.ISetRemove(set);
    }
    function testRemoveSS() : void {
        var set = new StringSet;
        this.ISetRemove(set);
    }
    function ISetRemove(set : ISet.<string>) : void {
        set.insert(["b", "c", "c", "d"]);

        set.remove(["c", "d"]);
        this.expect(set.toArray()).toEqual(["b"]);

        set.remove("bb");
        this.expect(set.toArray()).toEqual(["b"]);
    }

    function testIgnoreCaseStringSet() : void {
        var set = new Set.<string>( (a , b ) -> StringUtil.compareIgnoreCase(a, b) );

        set.insert(["foo", "BAR", "Baz"]);

        this.expect(set.contains("foo")).toBe(true);
        this.expect(set.contains("FOO")).toBe(true);
        this.expect(set.contains("bar")).toBe(true);
        this.expect(set.contains("BAR")).toBe(true);
        this.expect(set.contains("baz")).toBe(true);
        this.expect(set.contains("BAZ")).toBe(true);

        this.expect(set.toArray(), "ignore-cased string set saving cases").toEqual(["BAR", "Baz", "foo"]);
    }
}

// vim: set expandtab:
