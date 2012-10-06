import "./detail/east-asian-width.jsx";
import "./detail/stable-sort.jsx";

final class ListUtil.<T> {

    static function clone(a : T[]) : T[] {
        return a.slice(0);
    }

    static function copyForward(src : T[], srcPos : int, dest : T[], destPos : int, count : int) : void {
        assert src != dest || srcPos >= destPos;
        var end = destPos + count;
        while (destPos < end) {
            dest[destPos++] = src[srcPos++];
        }
    }

    static function copyBackward(src : T[], srcPos : int, dest : T[], destPos : int, count : int) : void {
        assert src != dest || srcPos <= destPos;
        var s = srcPos  + count;
        var d = destPos + count;
        while (d > destPos) {
            dest[--d] = src[--s];
        }
    }

    static function lowerBound(a : T[], begin : int, end : int, value : Nullable.<T>, cmp : (Nullable.<T>, Nullable.<T>)->int) : int {
        var left  = begin;
        var right = end;
        assert left <= right;

        while (left < right) {
            var mid = left + ((right - left) >>> 1); // (a+b)/2 causes overflow
            if (cmp(a[mid], value) < 0) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        assert left == right;
        return left;
    }

    static function upperBound(a : T[], begin : int, end : int, value : Nullable.<T>, cmp : (Nullable.<T>, Nullable.<T>)->int) : int {
        var left  = begin;
        var right = end;
        assert left <= right;

        while (left < right) {
            var mid = left + ((right - left) >>> 1); // (a+b)/2 causes overflow
            if (cmp(a[mid], value) <= 0) {
                left = mid + 1;
            }
            else {
                right = mid;
            }
        }
        assert left == right;
        return left;
    }

    /**
     * Swaps <code>a[i]</code> and <code>a[j]</code>
     */
    static function swap(a : T[], i : int, j : int) : void {
        var t = a[i];
        a[i]  = a[j];
        a[j]  = t;
    }

    // Fisher-Yates shuffle
    static function shuffle(a : T[]) : T[] {
        var r = ListUtil.<T>.clone(a);
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

    /**
     * Sorts an array and return a sorted copy of the array.
     * This sort is stable.
     */
    static function sort(a : T[], cmp : (Nullable.<T>, Nullable.<T>) -> int) : T[] {
        var r = ListUtil.<T>.clone(a);
        StableSort.<T>.sortInPlace(r, 0, r.length, cmp);
        return r;
    }

    /**
     * Sorts a range of an array and return a sorted copy of the array.
     * This sort is stable.
     */
    static function sort(a : T[], begin : int, end : int, cmp : (Nullable.<T>, Nullable.<T>) -> int) : T[] {
        var r = ListUtil.<T>.clone(a);
        StableSort.<T>.sortInPlace(r, begin, end, cmp);
        return r;
    }

    /**
     * Sorts an array in place.
     * This sort is stable.
     */
    static function sortInPlace(a : T[], cmp : (Nullable.<T>, Nullable.<T>) -> int) : void {
        StableSort.<T>.sortInPlace(a, 0, a.length, cmp);
    }

    /**
     * Sorts a range of an an array in place.
     * This sort is stable.
     */
    static function sortInPlace(a : T[], begin : int, end : int, cmp :  (Nullable.<T>, Nullable.<T>) -> int) : void {
        StableSort.<T>.sortInPlace(a, begin, end, cmp);
    }

    /**
     * Makes an array of the specified number of items.
     *
     * @param n the number of items
     * @param maker called with the index and expected to make an item
     */
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

final class Enumerable.<C, E> {
    var _c : C;

    static function from(collection : C) : Enumerable.<C, E> {
        return new Enumerable.<C, E>(collection);
    }

    function constructor(c : C) {
        this._c = c;
    }

    function forEach(cb : function(:Nullable.<E>):boolean) : void {
        for (var i = 0, length = this._c.length; i < length; ++i) {
            if (! cb(this._c[i])) {
                break;
            }
        }
    }

    function forEach(cb : function(:Nullable.<E>, :int):boolean) : void {
        for (var i = 0, length = this._c.length; i < length; ++i) {
            if (! cb(this._c[i], i)) {
                break;
            }
        }
    }
}

final class StringUtil {
    static function forEachByte(str : string, cb : function (:int):boolean) : void {
        StringUtil.forEachChar(str, (c) -> {
            if (c < 0x80) { // 1 byte
                return cb(c);
            }
            else if (c < 0x0800) { // 2 bytes
                return cb( (c >>>  6)          | 0xC0)
                    && cb( (c          & 0x3F) | 0x80);
            }
            else if (c < 0x10000) { // 3 bytes
                return cb(  (c >>> 12)         | 0xE0)
                    && cb( ((c >>>  6) & 0x3F) | 0x80)
                    && cb( ( c         & 0x3F) | 0x80);
            }
            else { // 4 bytes
                return cb(  (c >>> 18)         | 0xF0)
                    && cb( ((c >>> 12) & 0x3F) | 0x80)
                    && cb( ((c >>>  6) & 0x3F) | 0x80)
                    && cb( ( c         & 0x3F) | 0x80);
            }
        });
    }

    static function byteLength(str : string) : int {
        var count = 0;
        StringUtil.forEachByte(str, (b) -> {
            ++count;
            return true;
        });
        return count;
    }

    static function _isSurrogatePair(c : int) : boolean {
        return 0xD800 <= c && c <= 0xD8FF;
    }

    /**
      * Repeats string for each character, considering surrogate pairs.
      * The loop will be finished if the callback returns false.
      */
    static function forEachChar(str : string, cb : function(c : int) : boolean) : void {

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

    static function charLength(str : string) : int {
        var count : int = 0;
        StringUtil.forEachChar(str, (c) -> {
            ++count;
            return true;
        });
        return count;
    }

    /**
      * Calculates the width of a string.
      *
      * @see http://www.unicode.org/reports/tr11/
      */
    static function visualWidth(str : string) : int {
        var width : int = 0;
        StringUtil.forEachChar(str, (c) -> {
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
        StringUtil.forEachChar(str, (c) -> {
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

final class NumberUtil {
    static function format(n : number, precision : int) : string {
        return NumberUtil.format(n, precision, 0);
    }

    static function format(n : number, precision : int, width : int) : string {
        var i = n as int;

        var s = i as string;

        if (precision > 0) {
            var prefixLength = 2; /* "0.length" */
            var f = ((n - i) as string).slice(prefixLength, prefixLength+precision);
            f += StringUtil.repeat("0", precision - f.length);
            s += "." + f;
        }

        return StringUtil.repeat(" ", width - s.length) + s;
    }

}

// vim: set expandtab:
