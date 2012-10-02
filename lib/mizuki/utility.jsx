import "./detail/east-asian-width.jsx";

final class ListUtil.<T> {

    static function copy(a : T[]) : T[] {
        return a.slice(0);
    }

    /**
     * Swaps <code>a[i]</code> and <code>a[j]</code>
     */
    static function swap(a : T[], i : int, j : int) : void {
        var t = a[i];
        a[i]  = a[j];
        a[j]  = t;
    }

    // Fisher–Yates shuffle
    static function shuffle(a : T[]) : T[] {
        var r = ListUtil.<T>.copy(a);
        ListUtil.<T>.shuffleInPlace(r);
        return r;
    }

    static function shuffleInPlace(a : T[]) : void {
        ListUtil.<T>.shuffleInPlace(a, 0, a.length);
    }

    static function shuffleInPlace(a : T[], begin : int, end : int) : void {
        for (var i = begin; i < end; ++i) {
            var j = (Math.random() * i) as int;
            ListUtil.<T>.swap(a, i, j);
        }
    }

    static function reverseInPlace(a : T[]) : void {
        ListUtil.<T>.reverseInPlace(a, 0, a.length);
    }

    static function reverseInPlace(a : T[], begin : int, end : int) : void {
        assert begin >= 0;
        assert begin <= end;
        assert end <= a.length;

        --end;
        while (begin < end) {
            ListUtil.<T>.swap(a, begin++, end--);
        }
    }

    static function make(n : int, maker : (int) -> T) : T[] {
        var a = new T[](n);
        for (var i = 0; i < n; ++i) {
            a[i] = maker(i);
        }
        return a;
    }

    static function zip(a : T[], b : T[]) : T[][] {
        assert a.length == b.length;
        return ListUtil.<T>.zip(a, b, 0, a.length);
    }

    static function zip(a : T[], b : T[], begin : int, end : int) : T[][] {
        assert a.length == b.length;
        var r = new T[][];
        for (var i = begin; i < end; ++i) {
            r[i] = [ a[i], b[i] ];
        }
        return r;
    }
}

final class StringUtil {
    static function byteLength(str : string) : int {
        var count = 0;
        var u = String.encodeURIComponent(str);
        var s = u.replace(/%\w\w/g, (s) -> {
            count++;
            return "";
        });
        return s.length + count;
    }

    static function _isSurrogatePair(c : int) : boolean {
        return 0xD800 <= c && c <= 0xD8FF;
    }

    /**
      * Repeats string for each character, considering surrogate pairs.
      */
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
      * Calculates the width of a string.
      *
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

    /**
      * Truncates string by a visual width.
      * e.g. <code>StringUtil.truncate("foobarbaz", 6, "...")</code> produces
      * <code>"foo..."</code>.
      *
      * @see http://www.unicode.org/reports/tr11/
      */
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
