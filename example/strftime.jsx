import "POSIX.jsx";

class _Main {
	static function main(args : string[]) : void {
		log POSIX.strftime(new Date, args.join(" ") ?: "%c");
	}
}

