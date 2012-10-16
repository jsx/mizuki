import "../lib/mizuki/benchmark.jsx";
import "../lib/mizuki/collection.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
    static function main(args : string[]) : void {
        var n = (args.length > 0 ? args[0] as int : 1000);

        var map   = new Map.<boolean>();
        var array = new Array.<string>();
        var set   = new Set.<string>((a, b) -> StringUtil.compare(a, b));
        var sset  = new StringSet();

        var b = new Benchmark();

        b.log("Elements: " + n as string);
        b.session("Benchmark for adding elements", () -> {
            b.timeit("Array    ", () -> {
                for (var i = 0; i < n; ++i) {
                    var value = "foo" + i as string;
                    if (array.indexOf(value) == -1) {
                        array.push(value);
                    }
                }
            });
            b.timeit("Map      ", () -> {
                for (var i = 0; i < n; ++i) {
                    map["foo" + i as string] = true;
                }
            });
            b.timeit("Set      ", () -> {
                for (var i = 0; i < n; ++i) {
                    set.insert("foo" + i as string);
                }
            });
            b.timeit("StringSet", () -> {
                for (var i = 0; i < n; ++i) {
                    sset.insert("foo" + i as string);
                }
            });
        });

        assert array.length == n;
        assert set.size() == n;

        b.session("Benchmark for checking all the existing elements", () -> {
            b.timeit("Array    ", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = array.indexOf("foo" + i as string) != -1;
                }
            });
            b.timeit("Map      ", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = map.hasOwnProperty("foo" + i as string);
                }
            });
            b.timeit("Set      ", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = set.contains("foo" + i as string);
                }
            });
            b.timeit("StringSet", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = sset.contains("foo" + i as string);
                }
            });
        });

        b.session("Benchmark for checking non-existing elements", () -> {
            b.timeit("Array    ", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = array.indexOf("foox" + i as string) != -1;
                }
            });
            b.timeit("Map      ", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = map.hasOwnProperty("foox" + i as string);
                }
            });
            b.timeit("Set      ", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = set.contains("foox" + i as string);
                }
            });
            b.timeit("StringSet", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = sset.contains("foox" + i as string);
                }
            });
        });
    }
}

// vim: set expandtab:
