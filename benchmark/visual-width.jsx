
import "console.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {

	static function timeit(block : function():void) : number {
		var N = 10000;

		var t0 = Date.now();
		for (var i = 0; i < N; ++i) {
			block();
		}
		return Date.now() - t0;
	}



	static function main(args : string[]) : void {
		var N = 10000;
		var s = StringUtil.repeat("[✽こんにちは世界✽]", 100);

		var c = 0;
		var elapsed = _Main.timeit( () -> {
			c += StringUtil.visualWidth(s);
		});
		console.log(c as string);
		console.log("visualWidth: " + elapsed  as string + "[ms]");
	}
}
