
/**
 * Set of DateTime formatting utilities
 */
class DateTime {
    /**
      * POSIX compatible <code>strftime()</code>.
      * e.g. <code>DateTime.strftime(new Date, "%Y-%m-%d %H:%M:%S.%3N")</code>
      * returns, for example, <code>2012-09-23 22:02:55.863</code>.
      *
      * @param date Date instance to be formatted
      * @param format formatting parameter
      * @see   strftime(3)
      */
    static function strftime(date : Date, format : string) : string {
        return _DateFormat.strftime(date, format, _Locale.get());
    }

    static function strftime(date : Date, format : string, locale : string) : string {
        return _DateFormat.strftime(date, format, _Locale.get(locale));
    }

    /**
      * POSIX compatible <code>strptime()</code>.
      * A string made by <code>strftime()</code> should be parsed by
      * <code>strptime()</code> with the same format parameter.
      *
      * @param date string representation of a date/time
      * @param format format parameter
      * @see   strptime(3)
      */
    static function strptime(date : string, format : string) : Date {
        return _DateFormat.strptime(date, format, _Locale.get());
    }

    static function strptime(date : string, format : string, locale : string) : Date {
        return _DateFormat.strptime(date, format, _Locale.get(locale));
    }


    /**
      * Sets the current locale by name. The default is "en".
      */
    static function setLocale(name : string) : void {
        _Locale.setCurrentLocale(name);
    }

    /**
     * Registeres a new locale setting for DateTime format.
     *
     * @param name the name of the locale
     * @param A full weekday names used in %A
     * @param a abbreviated weekday names used in %a
     * @param B full month names used in %B
     * @param b abbreviated month name used in %b
     */
    static function addLocale(name : string, A : string[], a : string[], B : string[], b : string[]) : void {
        _Locale.register(name, new _Locale(name, A, a, B, b));
    }

}

class _Locale {
    static var currentLocale = "en";

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
            ["1月", "2月", "3月", "4月", "5月",
                "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            ["1月", "2月", "3月", "4月", "5月",
                "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
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

    // name may be "En", "en_US", "en_US.utf8"
    static function normalize(name : string) : string {
        return name.split(/_/)[0].toLowerCase();
    }

    static function get() : _Locale {
        return _Locale.locale[_Locale.currentLocale]
            ?: _Locale.locale["en"];
    }

    static function get(name : string) : _Locale {
        return _Locale.locale[_Locale.normalize(name)] ?: _Locale.get();
    }

    static function register(name : string, locale : _Locale) : void {
        _Locale.locale[_Locale.normalize(name)] = locale;
    }

    static function setCurrentLocale(name : string) : void {
        _Locale.currentLocale = _Locale.normalize(name);
    }
}

class _DateFormat {
    static const _NO_PADDING      = "-";
    static const _SPACE_PADDING   = "_";
    static const _ZERO_PADDING    = "0";

    static const CurrentTZOffset = (new Date(0)).getTimezoneOffset();

    static function strftime(date : Date, fmt : string, locale : _Locale) : string {
        var r = "";

        _DateFormat._parseFormat(fmt, (isFormat, c, padding, width) -> {
            r += isFormat
                ? _DateFormat._format(date, c, padding, width, locale)
                : c;
        });

        return r;
    }

    static function _parseFormat(fmt : string, cb : (boolean, string, string, number) -> void) : void {

        for (var i = 0; i < fmt.length; ++i) {
            var c = fmt.charAt(i);
            if (c == "%") {
                c = fmt.charAt(++i);

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

                var width = 0;
                while (/^[0-9]/.test(fmt.charAt(i))) {
                    width = (width * 10) + fmt.charAt(i) as int;
                    c = fmt.charAt(++i);
                }
                cb(true, c, padding, width);
            }
            else {
                cb(false, c, "", 0);
            }
        }
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
        case "c": // ISO-8601 "%Y-%m-%dT%H:%M:%S.%3N+%Z"
            return _DateFormat._format(d, "Y", p, w, l)
                    + "-"
                    + _DateFormat._format(d, "m", p, w, l)
                    + "-"
                    + _DateFormat._format(d, "d", p, w, l)
                    + "T"
                    + _DateFormat._format(d, "H", p, w, l)
                    + ":"
                    + _DateFormat._format(d, "M", p, w, l)
                    + ":"
                    + _DateFormat._format(d, "S", p, w, l)
                    + "."
                    + _DateFormat._format(d, "N", p, 3, l)
                    + _DateFormat._format(d, "z", p, w, l)
                    ;
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
                var nanoseconds = (d.getMilliseconds() * 1000 * 1000) as int;
                if (w == 0 || w >= 9) {
                    return _DateFormat._pad(nanoseconds, w ?: 9, p ?: "0");
                }
                return _DateFormat._pad((nanoseconds / Math.pow(10, 9 - w)) as int, w, p ?: "0");
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
            return _DateFormat._pad(_DateFormat._week_number(d), w ?: 2, p);
        case "v":
            return _DateFormat._format(d, "e", p, w, l) + "-"
                + _DateFormat._format(d, "b", p, w, l) + "-"
                + _DateFormat._format(d, "Y", p, w, l);
        case "W":
            return _DateFormat._pad(_DateFormat._week_of_month(d), w ?: 2, p);
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

    static function _week_number(d : Date) : number {
        throw new Error("[FIXME] not yet implmented");
    }

    static function _week_of_month(d : Date) : number {
        throw new Error("[FIXME] not yet implmented");
    }

    static function strptime(date : string, fmt: string, locale : _Locale) : Date {
        var tm = new _Tm;

        _DateFormat._parseFormat(fmt, (isFormat, c, padding, width) -> {
            if (isFormat) {
                date = _DateFormat._parse(tm, date, c, padding, width, locale);
            }
            else {
                if (date.charAt(0) == c) {
                    date = date.slice(1);
                }
                else {
                    throw new Error("strptime: expect '" + c + "' for '" + date + "'");
                }
            }
        });
        if (date != "") {
            throw new Error("strptime: failed to parse '" + date + "'");
        }
        return new Date(Date.UTC(
                tm.year, tm.month, tm.date,
                tm.hours, tm.minutes, tm.seconds, tm.ms) + (tm.tz * 60 * 1000));
    }

    static function _parse(tm : _Tm, date : string, c : string, p : string, w : number, l : _Locale) : string {
        var match = function (p : RegExp, f : function (x : int) : void) : string {
            var m = p.exec(date);
            if (! m) {
                throw new Error("strptime: failed to parse '" + date + "'");
            }

            f(m[0] as int);
            return date.slice(m[0].length);
        };

        date = date.replace(/^[ \t]+/, "");

        switch (c) {
        case "A":
            return _DateFormat._parseWeekDay(tm, date, l.A);
        case "a":
            return _DateFormat._parseWeekDay(tm, date, l.a);
        case "B":
            return _DateFormat._parseMonth(tm, date, l.B);
        case "b":
            return _DateFormat._parseMonth(tm, date, l.b);

        case "Y":
            return match(/^\d{4}/, (x : int) : void ->  {
                tm.year = x;
            });
        case "y":
            return match(/^\d{2}/, (x : int) : void ->  {
                x += 1900;
                if (x < 1970) {
                    x += 100;
                }
                tm.year = x;
            });
        case "m":
            return match(/^(?:1[0-2]|0?[1-9])/, (x : int) : void -> {
                tm.month = x - 1;
            });
        case "d":
            return match(/^(?:[12][0-9]|3[01]|0?[1-9])/, (x : int) : void -> {
                tm.date = x;
            });
        case "H":
            return match(/^(?:2[0-4]|[0-1]?[0-9])/, (x : int) : void -> {
                tm.hours = x;
            });
        case "M":
            return match(/^(?:[0-5]?[0-9])/, (x : int) : void -> {
                tm.minutes = x;
            });
        case "S":
            return match(/^(?:60|[0-5]?[0-9])/, (x : int) : void -> {
                tm.seconds = x;
            });

        case "N": // nanoseconds (%6N is microseconds; %3N is milliseconds)
            return match(new RegExp("^[0-9]{" + (w ?: 9) as string + "}"), (x : int) : void -> {
                var unit = Math.pow(10, (w ?: 9) - 3);
                tm.ms = (x / unit) as int;
            });

        case "Z":
            var m = /^\w+/.exec(date);
            if (! m) {
                throw new Error("strptime: failed to parse '" + date.charAt(0) + "'");
            }
            tm.tzName = m[0];
            if (/^(?:UTC|GMT)$/i.test(tm.tzName)) {
                tm.tz = 0;
            }
            return date.slice(m[0].length);
        case "z": // timezone offset "Z" | "+hh:mm" | "+hhmm" | "+hh"
            return (function () : string {
                var m = /^([+-])(2[0-4]|[0-1][0-9])(?:[:]?([0-5][0-9]))?/.exec(date);
                if (m) {
                    tm.tz = (m[2] as int) * 60;
                    if (m[3] != null) {
                        tm.tz += m[3] as int;
                    }

                    if (m[1] == "+") {
                        tm.tz = -tm.tz;
                    }

                    return date.slice(m[0].length);
                }

                if (date.charAt(0) != "Z") {
                    throw new Error("strptime: failed to parse '" + date + "'");
                }
                tm.tz = 0;
                return date.slice(1); // skip "Z"
            }());

        }
        return date.slice(1);
    }

    static function _parseWeekDay(tm : _Tm, date : string, names : string[]) : string {
            var m = (new RegExp("^" + names.join("|"), "i")).exec(date);
            if (! m) {
                throw new Error("strptime: failed to parse week date in '" + date + "'");
            }
            // parse only. does not change tm
            return date.slice(m[0].length);
    }

    static function _parseMonth(tm : _Tm, date : string, names : string[]) : string {
        var m = (new RegExp("^" + names.join("|"), "i")).exec(date);
        if (! m) {
            throw new Error("strptime: failed to parse month in '" + date + "'");
        }

        tm.month = names.indexOf(_DateFormat._toTitleCase(m[0]));
        return date.slice(m[0].length);
    }

    static function _toTitleCase(s : string) : string {
        return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    }
}

class _Tm {
    var year    = 0;
    var month   = 0;
    var date    = 1;
    var hours   = 0;
    var minutes = 0;
    var seconds = 0;
    var ms      = 0;

    var tz      = _DateFormat.CurrentTZOffset;
    var tzName  = "";
    var wday    = 0; // day of week
}

// vim: set expandtab:
