

class DateTime {
    // interfaces

    static function strftime(date : Date, fmt : string) : string {
        return _DateFormat.strftime(date, fmt, _Locale.get());
    }

    static function strftime(date : Date, fmt : string, locale : string) : string {
        return _DateFormat.strftime(date, fmt, _Locale.get(locale));
    }

    static function strptime(date : string, format : string) : Date {
        return _DateFormat.strptime(date, format, _Locale.get());
    }

    static function strptime(date : string, format : string, locale : string) : Date {
        return _DateFormat.strptime(date, format, _Locale.get(locale));
    }

    // locale settings

    static function addLocale(name : string, A : string[], a : string[], B : string[], b : string[]) : void {
        _Locale.locale[name] = new _Locale(name, A, a, B, b);
    }

}

class _Locale {
    static var _currentLocale = "en";

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

    static function get() : _Locale {
        return _Locale.locale[_Locale._currentLocale]
            ?: _Locale.locale["en"];
    }

    static function get(name : string) : _Locale {
        return _Locale.locale[name]
            ?: _Locale.locale[_Locale._currentLocale]
            ?: _Locale.locale["en"];
    }
}

class _DateFormat {
    static const _NO_PADDING      = "-";
    static const _SPACE_PADDING   = "_";
    static const _ZERO_PADDING    = "0";

    static function strftime(date : Date, fmt : string, locale : _Locale) : string {
        var r = "";

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
                while (/^[0-9]/.test(fmt.charAt(i))) {
                    width = (width * 10) + fmt.charAt(i) as int;
                    c = fmt.charAt(++i);
                }
                r += _DateFormat._format(date, c, padding, width, locale);
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
            return _DateFormat._pad((d.getFullYear() / 100) as int, w ?: 2, p ?: "0");
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
        case "G": // FIXME
            return _DateFormat._format(d, "Y", p, w, l);
        case "g": // FIXME
            return _DateFormat._format(d, "y", p, w, l);
        case "H":
            return _DateFormat._pad(d.getHours(), w ?: 2, p ?: "0");
        case "h":
            return _DateFormat._format(d, "b", p, w, l);
        case "I":
            return _DateFormat._pad(d.getHours() % 12 ?: 12, w ?: 2, p ?: "0");
        case "j": // day of year
            return (function() : string {
                var first = new Date(d.getFullYear(), 0, 1);
                var msOfYear = d.getTime() - first.getTime();
                return _DateFormat._pad(Math.ceil(msOfYear / (24 * 60 * 60 * 1000)), w ?: 3, p ?: "0");
            }());
        case "k":
            return _DateFormat._pad(d.getHours(), w ?: 2, p ?: " ");
        case "l":
            return _DateFormat._pad(d.getHours() % 12 ?: 12, w ?: 2, p ?: " ");
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
        case "r":
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
            return (function() : string {
                var first = new Date(d.getFullYear(), 0, 1);
                var msOfYear = d.getTime() - first.getTime();
                return _DateFormat._pad(Math.ceil(msOfYear / (7 * 24 * 60 * 60 * 1000)), w ?: 0, p ?: _DateFormat._NO_PADDING);
            }());
        case "u":
            return (d.getDay() ?: 7) as string;
        case "V":
            /* replaced by the week number of the year (Monday as the first
               day of the week) as a decimal number (01-53).  If the week con-
               taining January 1 has four or more days in the new year, then it
               is week 1; otherwise it is the last week of the previous year,
               and the next week is week 1.
              */
            return "[FIXME:V]";
        case "v":
            return _DateFormat._format(d, "e", p, w, l) + "-"
                + _DateFormat._format(d, "b", p, w, l) + "-"
                + _DateFormat._format(d, "Y", p, w, l);
        case "W":
            return "[FIXME:W]";
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
        case "Z": // timezone name
            return (function() : string {
                var s = d.toString();
                var pos = s.lastIndexOf("(");
                if (pos != -1) {
                    s = s.slice(pos+1);
                    return s.slice(0, s.indexOf(")"));
                }
                else {
                    return "";
                }
            }());
        case "z": // e.g. "+0900" for TZ=JST-9, "+0912" for TZ=JST-9:12
            return (function() : string {
                var o    = -d.getTimezoneOffset();
                var sign = o >= 0 ? "+" : "-";
                o = Math.abs(o);

                var h = _DateFormat._pad((o / 60) as int, (w/2) ?: 2, p ?: "0");
                var m = _DateFormat._pad((o % 60) as int, (w/2) ?: 2, p ?: "0");
                return sign + h + m;
            }());
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

    static function strptime(date : string, fmt: string, locale : _Locale) : Date {
        var r = new Date(0);

        for (var i = 0; i < fmt.length; ++i) {
            var c = fmt.charAt(i);
            if (c == "%") {
                c = fmt.charAt(++i);
                // flags (compatibility for strftime())
                switch (c) {
                case _DateFormat._NO_PADDING:
                case _DateFormat._SPACE_PADDING:
                case _DateFormat._ZERO_PADDING:
                    c = fmt.charAt(++i);
                    break;
                }
                // field width (compatibility for strftime())
                while (/^[0-9]/.test(fmt.charAt(i))) {
                    c = fmt.charAt(++i);
                }
                date = _DateFormat._parse(r, date, c, locale);
            }
            else {
                date = date.slice(1);
            }
        }
        return r;
    }

    static function _parse(r : Date, date : string, c : string, l : _Locale) : string {
        var match = function (p : RegExp, f : function (x : int) : void) : string {
            var m = /^\d+/.exec(date);
            if (m) {
                f(m[0] as int);
                return date.slice(m[0].length);
            }
            else {
                return date.slice(1);
            }
        };

        switch (c) {
        case "B":
            return _DateFormat._parseMonth(r, date, l.B);
        case "b":
            return _DateFormat._parseMonth(r, date, l.b);

        case "Y":
            return match(/^\d+/, (x : int) : void ->  { r.setFullYear(x); });
        case "y":
            return match(/^\d+/, (x : int) : void ->  {
                x += 1900;
                if (x < 1970) {
                    x += 100;
                }
                r.setFullYear(x);
            });
        case "m":
            return match(/^\d+/, (x : int) : void -> { r.setMonth(x - 1); });
        case "d":
            return match(/^\d+/, (x : int) : void ->  { r.setDate(x); });
        case "H":
            return match(/^\d+/, (x : int) : void -> { r.setHours(x); });
        case "M":
            return match(/^\d+/, (x : int) : void -> { r.setMinutes(x); });
        case "S":
            return match(/^\d+/, (x : int) : void -> { r.setSeconds(x); });
        }
        return date.slice(1);
    }

    static function _parseMonth(r : Date, date : string, names : string[]) : string {
        var m = (new RegExp("^" + names.join("|") + "\\b", "i")).exec(date);
        if (m) {
            r.setMonth(names.indexOf(_DateFormat._toCamelCase(m[0])));
            return date.slice(m[0].length);
        }
        return date.slice(1);
    }

    static function _toCamelCase(s : string) : string {
        return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    }
}

// vim: set expandtab:
