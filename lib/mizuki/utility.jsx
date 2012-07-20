import "./detail/east-asian-width.jsx";

class ListUtil.<T> {

    // Fisher–Yates shuffle
    static function shuffle(a : T[]) : T[] {
        var r = a.slice(0);
        ListUtil.<T>.shuffleInPlace(r);
        return r;
    }

    static function shuffleInPlace(a : T[]) : void {
        ListUtil.<T>.shuffleInPlace(a, 0, a.length);
    }

    static function shuffleInPlace(a : T[], begin : int, end : int) : void {
        for (var i = begin; i < end; ++i) {
            var j = (Math.random() * i) as int;
            var t = a[i];
            a[i]  = a[j];
            a[j]  = t;
        }
    }

}

class StringUtil {
    static function _isSurrogatePair(c : int) : boolean {
        return 0xD800 <= c && c <= 0xD8FF;
    }

    static function forEach(str : string, cb : function(c : int) : boolean) : void {

        for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (StringUtil._isSurrogatePair(c)) {
                c = 0x10000 +
                    ((c & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);

            }
            if (! cb(c)) {
                break;
            }
        }
    }

    /**
      * calculates the width of a string
      * @see http://www.unicode.org/reports/tr11/
      */
    static function visualWidth(str : string) : int {
        var width : int = 0;
        StringUtil.forEach(str, (c) -> {
            width += EastAsianWidth.isFullWidth(c) ? 2 : 1;

            return true;
        });
        return width;
    }

    static function truncate(str : string, maxWidth : int, suffix : string) : string {
        if (StringUtil.visualWidth(str) <= maxWidth) {
            return str;
        }

        var s = "";
        var width = StringUtil.visualWidth(suffix);
        StringUtil.forEach(str, (c) -> {
            width += EastAsianWidth.isFullWidth(c) ? 2 : 1;
            if (width > maxWidth) {
                return false;
            }
            s += String.fromCharCode(c);
            return true;
        });
        return s + suffix;
    }

    static function compare(a : string, b : string) : int {
        return a.localeCompare(b);
    }

    static function compareIgnoreCase(a : string, b : string) : int {
        return StringUtil.compare(a.toUpperCase(), b.toUpperCase());
    }

    static function repeat(str : string, count : int) : string {
        var s = "";
        for (var i = 0; i < count; ++i) {
            s += str;
        }
        return s;
    }

}

// vim: set expandtab:
