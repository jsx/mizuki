
import "console.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
	static function main(args : string[]) : void {
		var N = 10000;
		var s = StringUtil.repeat("[こんにちは世界]", 100);

		console.time("length");
		var c = 0;
		for (var i = 0; i < N; ++i) {
			c += s.length;
		}
		console.timeEnd("length");

		console.time("visualWidth");
		var c = 0;
		for (var i = 0; i < N; ++i) {
			c += StringUtil.visualWidth(s);
		}
		console.timeEnd("visualWidth");
	}
}
