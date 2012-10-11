/***
 * This module includes set of utilities for built-in classes and
 * primitive values.
 *
 */

import "./detail/east-asian-width.jsx";
import "./detail/stable-sort.jsx";

final class ArrayUtil.<T> {

    /**
     * Returns a shallow copy of array.
     */
    static function clone(array : T[]) : T[] {
        return array.slice(0);
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

    static function equals(a : T[], b : T[]) : boolean {
        return ArrayUtil.<T>.equals(a, b, (x, y) -> x == y);
    }

    static function equals(a : T[], b : T[], equalsFunction : (Nullable.<T>, Nullable.<T>)->boolean) : boolean {
        if (a == b) {
            return true;
        }
        if (a.length != b.length) {
            return false;
        }
        for (var i = 0; i < a.length; ++i) {
            if (! equalsFunction(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }

    /*
     * Returns a position to the first element in the range [begin, end) that
     * is not <em>less</em> than value.
     *
     * Equivalent to <code>a.indexOf(value)</code>,
     * but the array must be sorted.
     */
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

    /*
     * Returns a position to the first element in the range [begin, end) that
     * is <em>greater</em> than value.
     *
     * Equivalent to <code>a.lastIndexOf(value)+1</code>,
     * but the array must be sorted.
     */
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
     * Swaps <code>a[i]</code> and <code>a[j]</code>.
     */
    static function swap(a : T[], i : int, j : int) : void {
        var t = a[i];
        a[i]  = a[j];
        a[j]  = t;
    }


    /**
     * Returns a shuffled array.
     */
    static function shuffle(array : T[]) : T[] {
        // Fisher-Yates shuffle
        var r = ArrayUtil.<T>.clone(array);
        ArrayUtil.<T>.shuffleInPlace(r);
        return r;
    }

    /**
     * Shuffles array in place.
     */
    static function shuffleInPlace(array : T[]) : void {
        ArrayUtil.<T>.shuffleInPlace(array, 0, array.length);
    }

    /**
     * Shuffles the range [begin, end) of array in place.
     */
    static function shuffleInPlace(array : T[], begin : int, end : int) : void {
        for (var i = begin; i < end; ++i) {
            var j = (Math.random() * i) as int;
            ArrayUtil.<T>.swap(array, i, j);
        }
    }

    /*
     * Reverses array in place.
     */
    static function reverseInPlace(array : T[]) : void {
        ArrayUtil.<T>.reverseInPlace(array, 0, array.length);
    }

    /*
     * Reverses the range [begin, end) of array in place.
     */
    static function reverseInPlace(a : T[], begin : int, end : int) : void {
        assert begin >= 0;
        assert begin <= end;
        assert end <= a.length;

        --end;
        while (begin < end) {
            ArrayUtil.<T>.swap(a, begin++, end--);
        }
    }

    /**
     * Sorts array and return a sorted copy of the array.
     * This sort is stable.
     */
    static function sort(a : T[], cmp : (Nullable.<T>, Nullable.<T>) -> int) : T[] {
        var r = ArrayUtil.<T>.clone(a);
        StableSort.<T>.sortInPlace(r, 0, r.length, cmp);
        return r;
    }

    /**
     * Returns the sorted copy of [begin, end) of array.
     * This sort is stable.
     */
    static function sort(a : T[], begin : int, end : int, cmp : (Nullable.<T>, Nullable.<T>) -> int) : T[] {
        var r = ArrayUtil.<T>.clone(a);
        StableSort.<T>.sortInPlace(r, begin, end, cmp);
        return r;
    }

    /**
     * Sorts array in place.
     * This sort is stable.
     */
    static function sortInPlace(a : T[], cmp : (Nullable.<T>, Nullable.<T>) -> int) : void {
        StableSort.<T>.sortInPlace(a, 0, a.length, cmp);
    }

    /**
     * Sorts the range [begin, end] of array in place.
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
        return ArrayUtil.<T>.zip(a, b, 0, a.length);
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

    function toArray() : Array.<E> {
        var a = new Array.<E>;
        this.forEach((item) -> {
            a.push(item);
            return true;
        });
        return a;
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
    /**
      * Repeats string for each byte, regarding its encoding as UTF-8.
      * The loop will be finished if the callback returns false.
      */
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
      * Calculates the visual width of a string.
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
            var prefixLength = 2; /* "0.".length */
            var f = ((n - i) as string).slice(prefixLength, prefixLength+precision);
            f += StringUtil.repeat("0", precision - f.length);
            s += "." + f;
        }

        return StringUtil.repeat(" ", width - s.length) + s;
    }

}

final class Base64 {
    static function encode(str : string) : string {
        return Base64._btoa(Base64._encode_utf8(str));
    }

    static function decode(str : string) : string {
        return Base64._decode_utf8(Base64._atob(str));
    }

    /* implementation */

    static const _b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    static const _b64tab = Base64._makeTable(Base64._b64chars);

    static function _makeTable(binary : string) : Map.<int> {
        var tab = new Map.<int>();
        for (var i = 0; i < binary.length; ++i) {
            tab[binary.charAt(i)] = i;
        }
        return tab;
    }

    // encode UTF16 text string to UTF-8 binary string
    static function _utob_cb(s : string) : string {
        var c = s.charCodeAt(0);

        if (c < 0x80) {
            return s;
        }
        else if (c < 0x800) {
            return String.fromCharCode(
                     (c >>>  6)         | 0xC0,
                     (c         & 0x3F) | 0x80);
        }
        else {
            return String.fromCharCode(
                    ((c >>> 12) & 0x0F) | 0xE0,
                    ((c >>>  6) & 0x3F) | 0x80,
                     (c         & 0x3F) | 0x80);
        }
    }

    static function _encode_utf8(str : string) : string {
        return str.replace(/[^\x00-\x7F]/g, Base64._utob_cb);
    }

    static function _btoa(bin : string) : string {
        return bin.replace(/.{1,3}/g, function (c) {
            switch (c.length) {
            case 1:
                var ord = (c.charCodeAt(0) << 16);
                return Base64._b64chars.charAt( ord >>> 18)
                     + Base64._b64chars.charAt((ord >>> 12) & 63)
                     + "==";
            case 2:
                var ord = (c.charCodeAt(0) << 16)
                        | (c.charCodeAt(1) <<  8);
                return Base64._b64chars.charAt( ord >>> 18)
                     + Base64._b64chars.charAt((ord >>> 12) & 63)
                     + Base64._b64chars.charAt((ord >>>  6) & 63)
                     + "=";
            default:
                var ord = (c.charCodeAt(0) << 16)
                        | (c.charCodeAt(1) <<  8)
                        |  c.charCodeAt(2);
                return Base64._b64chars.charAt( ord >>> 18)
                     + Base64._b64chars.charAt((ord >>> 12) & 63)
                     + Base64._b64chars.charAt((ord >>>  6) & 63)
                     + Base64._b64chars.charAt( ord         & 63);
            }
        });
    }

    static function _decode_utf8(bin : string) : string {
        return bin.replace(/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}/g, function (c) {
            var u : int;
            if (c.length < 3){
                u = ((c.charCodeAt(0) & 0x1F) <<  6)
                  |  (c.charCodeAt(1) & 0x3F);
            }
            else {
                u = ((c.charCodeAt(0) & 0x0F) << 12)
                  | ((c.charCodeAt(1) & 0x3F) <<  6)
                  |  (c.charCodeAt(2) & 0x3F);
            }
            return String.fromCharCode(u);
        });
    }

    static function _atob(str : string) : string {
        return str.replace(/.{1,4}/g, function (x) {
            var c = x.replace(/=/g, "");
            switch (c.length) {
            case 1:
                var ord = (Base64._b64tab[c.charAt(0)] << 18);
                return String.fromCharCode( ord >>> 16,
                                           (ord >>>  8) & 0xFF,
                                            ord         & 0xFF);
            case 2:
                var ord = (Base64._b64tab[c.charAt(0)] << 18)
                        | (Base64._b64tab[c.charAt(1)] << 12);
                var s = String.fromCharCode( ord >>> 16,
                                            (ord >>>  8) & 0xFF,
                                             ord         & 0xFF);
                return s.slice(0, 1);
            case 3:
                var ord = (Base64._b64tab[c.charAt(0)] << 18)
                        | (Base64._b64tab[c.charAt(1)] << 12)
                        | (Base64._b64tab[c.charAt(2)] <<  6);
                var s = String.fromCharCode( ord >>> 16,
                                            (ord >>>  8) & 0xFF,
                                             ord         & 0xFF);
                return s.slice(0, 2);
            default:
                var ord = (Base64._b64tab[c.charAt(0)] << 18)
                        | (Base64._b64tab[c.charAt(1)] << 12)
                        | (Base64._b64tab[c.charAt(2)] <<  6)
                        |  Base64._b64tab[c.charAt(3)];
                return String.fromCharCode( ord >>> 16,
                                           (ord >>>  8) & 0xFF,
                                            ord         & 0xFF);
            }
        });
    }
}

// vim: set expandtab:
