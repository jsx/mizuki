
/**
  * POSIX strftime(3) implementation
  */

class _Main {
	static function main(args : string[]) : void {
		log strftime.strftime(new Date, args.join(" ") ?: "%c");
	}
}

class _Locale {
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

class strftime {
	static var defaultLocale = "en";

	static var _locale : Map.<_Locale> = {
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
			]),
    ja: new _Locale("ja",
			["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
			["日", "月", "火", "水", "木", "金", "土"],
			[" 1月", " 2月", " 3月", " 4月", " 5月",
				" 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"],
			[" 1月", " 2月", " 3月", " 4月", " 5月",
				" 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"]
			)
	};

	static function addLocale(name : string, A : string[], a : string[], B : string[], b : string[]) : void {
		strftime._locale[name] = new _Locale(name, A, a, B, b);
	}


	static const _DEFAULT_PADDING = "~";
	static const _NO_PADDING      = "-";
	static const _SPACE_PADDING   = "_";
	static const _ZERO_PADDING    = "0";


	static function strftime(date : Date, fmt : string) : string {
		return strftime.strftime(date, fmt, strftime.defaultLocale);
	}

	static function strftime(date : Date, fmt : string, locale : string) : string {
		var r = "";
		var loc = strftime._locale;
		var l   = loc[locale] ?: loc[strftime.defaultLocale] ?: loc["en"];

		for (var i = 0; i < fmt.length; ++i) {
			var c = fmt.charAt(i);
			if (c == "%") {
				c = fmt.charAt(++i);
				var padding = "";
				switch (c) {
				case strftime._NO_PADDING:
				case strftime._SPACE_PADDING:
				case strftime._ZERO_PADDING:
					padding = c;
					c = fmt.charAt(++i);
				}
				r += strftime._format(date, c, padding, l);
			}
			else {
				r += c;
			}
		}
		return r;
	}

	static function _format(d: Date, c: string, p : string, l : _Locale) : string {
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
			return (d.getFullYear() / 100) as int as string;
		case "c":
			return d.toLocaleString();
		case "D":
			return strftime._format(d, "m", p, l) + "/"
					+ strftime._format(d, "d", p, l) + "/"
					+ strftime._format(d, "y", p, l);
		case "d":
			return strftime._pad(d.getDate(), 2, "0", p);
		case "e":
			return strftime._pad(d.getDate(), 2, " ", p);
		case "F":
			return strftime._format(d, "Y", p, l) + "-"
					+ strftime._format(d, "m", p, l) + "-"
					+ strftime._format(d, "d", p, l);
		case "H":
			return strftime._pad(d.getHours(), 2, "0", p);
		case "I":
			return strftime._pad(d.getHours() % 12 ?: 12, 2, "0", p);
		case "j": // day of year
			return "j"; // FIXME
		case "k":
			return strftime._pad(d.getHours(), 2, " ", p);
		case "l":
			return strftime._pad(d.getHours() % 12 ?: 12, 2, "0", p);
		case "M":
			return strftime._pad(d.getMinutes(), 2, "0", p);
		case "m":
			return strftime._pad(d.getMonth()+1, 2, "0", p);
		case "N":
			return (function() : string {
				var nanosecond = d.getMilliseconds() * 1000 * 1000;
				return strftime._pad(nanosecond, 9, "0", p);
			}());
		case "n":
			return "\n";
		case "p":
			return d.getHours() > 11 ? "PM" : "AM";
		case "P":
			return d.getHours() > 11 ? "pm" : "am";
		case "R":
			return strftime._format(d, "H", p, l) + ":"
				+ strftime._format(d, "M", p, l);
		case "R":
			return strftime._format(d, "I", p, l) + ":"
				+ strftime._format(d, "M", p, l) + ":"
				+ strftime._format(d, "S", p, l) + " "
				+ strftime._format(d, "p", p, l);
		case "S":
			return strftime._pad(d.getSeconds(), 2, "0", p);
		case "s":
			return (d.getTime() / 1000) as int as string;
		case "T":
			return strftime._format(d, "H", p, l) + ":"
				+ strftime._format(d, "M", p, l) + ":"
				+ strftime._format(d, "S", p, l);
		case "t":
			return "\t";
		case "U": // week of year
			return "U"; // FIXME
		case "u":
			return (d.getDay() ?: 7) as string;
		case "V":
			return "V"; // FIXME
		case "v":
			return strftime._format(d, "e", p, l) + "-"
				+ strftime._format(d, "b", p, l) + "-"
				+ strftime._format(d, "Y", p, l);
		case "W":
			return "W"; // FIXME
		case "w":
			return d.getDay() as string;
		case "X":
			return d.toTimeString();
		case "x":
			return d.toDateString();
		case "Y":
			return d.getFullYear() as string;
		case "y":
			return strftime._pad(d.getFullYear() % 100 , 2, "0", p);
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

	static function _pad (d : number, w : int, p : string, padMode: string) : string{
		var s = d as string;

		if (padMode == strftime._NO_PADDING) {
			return s;
		}
		else if (padMode == strftime._SPACE_PADDING) {
			p = " ";
		}
		else if (padMode == strftime._ZERO_PADDING) {
			p = "0";
		}

		while (s.length < w) {
			s = p + s;
		}
		return s;
	}
}

