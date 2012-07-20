import "../lib/mizuki/random/mt.jsx";
import "console.jsx";

class _Main {
	static function main(args : string[]) : void {
		var n = (args.length > 0 ? args.shift() as int : 1);

		var r = new MT();
		for (var i = 0; i < n; ++i) {
			console.log(r.nextUUID());
		}
	}
}

