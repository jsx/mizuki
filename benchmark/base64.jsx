import "../lib/mizuki/benchmark.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
    static function main(args : string[]) : void {
        var n = (args.length > 0 ? args[0] as int : 10);

        var text = StringUtil.repeat([
            "Hello, world! Wonrderful!",
            " [  ✽こんにちは世界✽  ]",
            "Здравствуйте!"
        ].join("\n"), n);

        var b = new Benchmark();
        b.session("Benchmark for Base64.encode()", () -> {
            var s = "";
            b.timeit("for text length=" + text.length as string, () -> {
                s = Base64.encode(text);
            });
            b.log("result length=" + s.length as string);
        });
        b.session("Benchmark for Base64.decode()", () -> {
            var a = Base64.encode(text);
            var s = "";
            b.timeit("for encoded length=" + a.length as string, () -> {
                s = Base64.decode(a);
            });
            b.log("result length=" + s.length as string);
        });
    }
}

// vim: set expandtab:
