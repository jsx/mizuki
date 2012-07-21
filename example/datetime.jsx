import "../lib/mizuki/datetime.jsx";

class _Main {
	static function main(args : string[]) : void {
		var d = new Date;

		if (args.length > 0) {
			DateTime.setLocale(args[0]);
		}

		var f = "[%a %b %d %Y %H:%M:%S.%3N GMT%z (%Z)]";

		var s = DateTime.strftime(d, f);
		log "strftime: " + s;
		log "strptime: " + DateTime.strftime(DateTime.strptime(s, f), f);
	}
}
