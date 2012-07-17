
import "console.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
	static function main(args : string[]) : void {
		var N = 10000;
		var s = StringUtil.repeat("[✽こんにちは世界✽]", 100);

		var t0 = Date.now();
		var c = 0;
		for (var i = 0; i < N; ++i) {
			c += s.length;
		}
		console.log("length : " + (Date.now() - t0)  as string + "[ms]");

		var t0 = Date.now();
		var c = 0;
		for (var i = 0; i < N; ++i) {
			c += StringUtil.visualWidth(s);
		}
		console.log("visualWidth: " + (Date.now() - t0)  as string + "[ms]");
	}
}
