
import "../lib/mizuki/benchmark.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
	static function main(args : string[]) : void {
		var n = (args.length > 0 ? args[0] as int : 100);

		var b = new Benchmark();
		b.enter("Benchmark for StringUtil.visualWidth()");

		var texts = [
			"Hello, world! Wonrderful!",
			" [  ✽こんにちは世界✽  ]",
			"Здравствуйте!"
		];

		texts.forEach( (text) -> {
			var s =  StringUtil.repeat(text, n);
			var c = 0;
			b.timeit("visualWidth for " + text, () -> {
				c = StringUtil.visualWidth(s);
			});
			b.log("(visual width: " + c as string + ";"
				+ " length: " + s.length as string + ")");
		});

		b.leave();
	}
}
