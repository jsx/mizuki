import "mizuki/random/mt.jsx";
import "mizuki/benchmark.jsx";

class _Main {
	static function main(args : string[]) : void {
		var N = 10 * 1000 * 1000;

		var b = new Benchmark();
		b.enter("generate " + N as string + " of random numbers");

		var sum = 0;

		b.timeit("Math.random()   ", () -> {
			sum = 0;
			for(var i = 0; i < N; i++) {
				sum += Math.random();
			}
		});
		b.log("(value : " + sum as string + ")");

		var mt = new MT(42);

		b.timeit("MT#nextReal32() ", () -> {
			sum = 0;
			for(var i = 0; i < N; i++) {
				sum += mt.nextReal32();
			}
		});
		b.log("(value : " + sum as string + ")");

		var mt = new MT(42);

		b.timeit("MT#nextReal()   ", () -> {
			sum = 0;
			for(var i = 0; i < N; i++) {
				sum += mt.nextReal();
			}
		});
		b.log("(value : " + sum as string + ")");

		b.leave();
	}

}
