import "../lib/mizuki/datetime.jsx";

class _Main {
	static function main(args : string[]) : void {
		log DateTime.strftime(new Date, args.join(" ") ?: "%c");
	}
}

