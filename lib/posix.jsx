

class POSIX {
	static var defaultLocale = "en";

	static function addLocale(name : string, A : string[], a : string[], B : string[], b : string[]) : void {
		_Locale.locale[name] = new _Locale(name, A, a, B, b);
	}

	static function strftime(date : Date, fmt : string) : string {
		return _DateFormat._strftime(date, fmt, POSIX.defaultLocale);
	}

	static function strftime(date : Date, fmt : string, locale : string) : string {
		return _DateFormat._strftime(date, fmt, locale);
	}

	static function isdigit(c : string) : boolean {
		return c in _CharClass.isdigit;
	}
}

class _Locale {
	static var locale : Map.<_Locale> = {
		en: new _Locale("en",
			[
				'Sunday', 'Monday', 'Tuesday', 'Wednesday',
				'Thursday', 'Friday', 'Saturday'
			],
        	[
				"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
			],
			[
				'January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'
			],
			[
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
				"Oct", "Nov", "Dec"
			]
		),
		ja: new _Locale("ja",
			["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
			["日", "月", "火", "水", "木", "金", "土"],
			[" 1月", " 2月", " 3月", " 4月", " 5月",
				" 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"],
			[" 1月", " 2月", " 3月", " 4月", " 5月",
				" 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"]
		)
	};

	var name : string;
	var A : string[];
	var a : string[];
	var B : string[];
	var b : string[];

	function constructor(name : string, A : string[], a : string[], B : string[], b : string[]) {
		this.name = name;

		this.A = A;
		this.a = a;
		this.B = B;
		this.b = b;
	}
}

class _DateFormat {
	static const _NO_PADDING      = "-";
	static const _SPACE_PADDING   = "_";
	static const _ZERO_PADDING    = "0";

	static function _strftime(date : Date, fmt : string, locale : string) : string {
		var r = "";
		var loc = _Locale.locale;
		var l   = loc[locale] ?: loc[POSIX.defaultLocale] ?: loc["en"];

		for (var i = 0; i < fmt.length; ++i) {
			var c = fmt.charAt(i);
			if (c == "%") {
				c = fmt.charAt(++i);
				// flags
				var padding = "";
				switch (c) {
				case _DateFormat._NO_PADDING:
					padding = c;
					c = fmt.charAt(++i);
					break;
				case _DateFormat._SPACE_PADDING:
					padding = " ";
					c = fmt.charAt(++i);
					break;
				case _DateFormat._ZERO_PADDING:
					padding = "0";
					c = fmt.charAt(++i);
					break;
				}
				// field width
				var width = 0;
				while (POSIX.isdigit(fmt.charAt(i))) {
					width = (width * 10) + fmt.charAt(i) as int;
					c = fmt.charAt(++i);
				}
				r += _DateFormat._format(date, c, padding, width, l);
			}
			else {
				r += c;
			}
		}
		return r;
	}

	static function _format(d: Date, c: string, p : string, w : int, l : _Locale) : string {
		switch (c) {
		case "A":
			return l.A[d.getDay()];
		case "a":
			return l.a[d.getDay()];
		case "B":
			return l.B[d.getMonth()];
		case "b":
			return l.b[d.getMonth()];
		case "C":
			return _DateFormat._pad(d.getFullYear() / 100 as int, w ?: 2, p ?: "0");
		case "c":
			return d.toLocaleString();
		case "D":
			return _DateFormat._format(d, "m", p, w, l) + "/"
					+ _DateFormat._format(d, "d", p, w, l) + "/"
					+ _DateFormat._format(d, "y", p, w, l);
		case "d":
			return _DateFormat._pad(d.getDate(), w ?: 2, p ?: "0");
		case "e":
			return _DateFormat._pad(d.getDate(), w ?: 2, p ?: " ");
		case "F":
			return _DateFormat._format(d, "Y", p, w, l) + "-"
					+ _DateFormat._format(d, "m", p, w, l) + "-"
					+ _DateFormat._format(d, "d", p, w, l);
		case "H":
			return _DateFormat._pad(d.getHours(), w ?: 2, p ?: "0");
		case "I":
			return _DateFormat._pad(d.getHours() % 12 ?: 12, w ?: 2, p ?: "0");
		case "j": // day of year
			return "j"; // FIXME
		case "k":
			return _DateFormat._pad(d.getHours(), w ?: 2, p ?: " ");
		case "l":
			return _DateFormat._pad(d.getHours() % 12 ?: 12, w ?: 2, p ?: "0");
		case "M":
			return _DateFormat._pad(d.getMinutes(), w ?: 2, p ?: "0");
		case "m":
			return _DateFormat._pad(d.getMonth()+1, w ?: 2, p ?: "0");
		case "N":
			return (function() : string {
				var nanosecond = (d.getMilliseconds() * 1000 * 1000) as int;
				if (w == 0 || w >= 9) {
					return _DateFormat._pad(nanosecond, w ?: 9, p ?: "0");
				}
				return _DateFormat._pad((nanosecond / Math.pow(10, 9 - w)) as int, w, p ?: "0");
			}());
		case "n":
			return "\n";
		case "p":
			return d.getHours() > 11 ? "PM" : "AM";
		case "P":
			return d.getHours() > 11 ? "pm" : "am";
		case "R":
			return _DateFormat._format(d, "H", p, w, l) + ":"
				+ _DateFormat._format(d, "M", p, w, l);
		case "R":
			return _DateFormat._format(d, "I", p, w, l) + ":"
				+ _DateFormat._format(d, "M", p, w, l) + ":"
				+ _DateFormat._format(d, "S", p, w, l) + " "
				+ _DateFormat._format(d, "p", p, w, l);
		case "S":
			return _DateFormat._pad(d.getSeconds(), w ?: 2, p ?: "0");
		case "s":
			return _DateFormat._pad((d.getTime() / 1000) as int, w ?: 0, p ?: _DateFormat._NO_PADDING);
		case "T":
			return _DateFormat._format(d, "H", p, w, l) + ":"
				+ _DateFormat._format(d, "M", p, w, l) + ":"
				+ _DateFormat._format(d, "S", p, w, l);
		case "t":
			return "\t";
		case "U": // week of year
			return "U"; // FIXME
		case "u":
			return (d.getDay() ?: 7) as string;
		case "V":
			return "V"; // FIXME
		case "v":
			return _DateFormat._format(d, "e", p, w, l) + "-"
				+ _DateFormat._format(d, "b", p, w, l) + "-"
				+ _DateFormat._format(d, "Y", p, w, l);
		case "W":
			return "W"; // FIXME
		case "w":
			return _DateFormat._pad(d.getDay(), w ?: 0, p ?: "");
		case "X":
			return d.toTimeString();
		case "x":
			return d.toDateString();
		case "Y":
			return d.getFullYear() as string;
		case "y":
			return _DateFormat._pad(d.getFullYear() % 100 , w ?: 2, p ?: "0");
		case "Z":
			return "Z"; // FIXME
		case "z":
			return "z"; // FIXME
		case "%":
			return "%";

		default:
			return c;
		}
	}

	static function _pad (d : number, w : int, p : string) : string{
		var s = d as string;
		if (p == _DateFormat._NO_PADDING) {
			return s;
		}

		while (s.length < w) {
			s = p + s;
		}
		return s;
	}
}

class _CharClass {
	static function _make(s : string) : Map.<boolean> {
		var map = new Map.<boolean>();
		s.split("").forEach( (c) -> {
			map[c] = true;
		});
		return map;
	}

	static const isdigit = _CharClass._make("0123456789");
}
