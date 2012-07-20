import "console.jsx";
import "mizuki/random/mt.jsx";

class _Main {
	static function main(args : string[]) : void {
		var N = 10 * 1000 * 1000;

		console.log("generate " + N as string + " of numbers\n");

		var sum = 0;
		var t0 = Date.now();
		for(var i = 0; i < N; i++) {
			sum += Math.random();
		}
		console.log(sum);
		console.log("Math.random() : " + (Date.now() - t0) as string + " ms");

		var mt = new MT(42);
		var sum = 0;
		var t0 = Date.now();
		for(var i = 0; i < N; i++) {
			sum += mt.nextReal32();
		}
		console.log(sum);
		console.log("MT#nextReal32() : " + (Date.now() - t0) as string + " ms");
		var mt = new MT(42);
		var sum = 0;
		var t0 = Date.now();
		for(var i = 0; i < N; i++) {
			sum += mt.nextReal();
		}
		console.log(sum);
		console.log("MT#nextReal() : " + (Date.now() - t0) as string + " ms");

	}
}
