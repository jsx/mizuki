import "../lib/mizuki/benchmark.jsx";
import "../lib/mizuki/collection.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
    static function main(args : string[]) : void {
        var n = (args.length > 0 ? args[0] as int : 1000);

        var map   = new Map.<boolean>();
        var array = new Array.<string>();
        var set   = new Set.<string>((a, b) -> StringUtil.compare(a, b));

        var b = new Benchmark();

        b.log("Elements: " + n as string);
        b.session("Benchmark for adding elements", () -> {
            b.timeit("ary", () -> {
                for (var i = 0; i < n; ++i) {
                    var value = "foo" + i as string;
                    if (array.indexOf(value) == -1) {
                        array.push(value);
                    }
                }
            });
            b.timeit("map", () -> {
                for (var i = 0; i < n; ++i) {
                    map["foo" + i as string] = true;
                }
            });
            b.timeit("set", () -> {
                for (var i = 0; i < n; ++i) {
                    set.insert("foo" + i as string);
                }
            });
        });

        assert array.length == n;
        assert set.size() == n;

        b.session("Benchmark for checking all the existing elements", () -> {
            b.timeit("ary", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = array.indexOf("foo" + i as string) != -1;
                }
            });
            b.timeit("map", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = map.hasOwnProperty("foo" + i as string);
                }
            });
            b.timeit("set", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = set.contains("foo" + i as string);
                }
            });
        });

        b.session("Benchmark for checking non-existing elements", () -> {
            b.timeit("ary", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = array.indexOf("foox" + i as string) != -1;
                }
            });
            b.timeit("map", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = map.hasOwnProperty("foox" + i as string);
                }
            });
            b.timeit("set", () -> {
                var b : boolean;
                for (var i = 0; i < n; ++i) {
                    b = set.contains("foox" + i as string);
                }
            });
        });
    }
}

// vim: set expandtab:
