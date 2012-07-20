import "../lib/mizuki/random-generator/mt.jsx";
import "console.jsx";

class _Main {
	static function main(args : string[]) : void {
		var r = new MT();
		console.log(r.nextUUID());
	}
}

