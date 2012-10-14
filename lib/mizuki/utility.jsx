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
        assert array != null;
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

    static function lowerBound(a : T[], value : Nullable.<T>, cmp : (Nullable.<T>, Nullable.<T>)->int) : int {
        return ArrayUtil.<T>.lowerBound(a, 0, a.length, value, cmp);
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

    static function upperBound(a : T[], value : Nullable.<T>, cmp : (Nullable.<T>, Nullable.<T>)->int) : int {
        return ArrayUtil.<T>.upperBound(a, 0, a.length, value, cmp);
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

/*
 * Base64 encoder/decoder, regarding UTF-8 as the encoding and respecting to surrogate pairs.
 */
final class Base64 {

    /*
     * Encodes the input str in Base64.
     * The input may be unicode text, so the function encodes str in UTF-8 first.
     */
    static function encode(str : string) : string {
        return Base64._btoa(Base64._encode_utf8(str));
    }

    /*
     * Decodes the input str in Base64, assuming the input is encoded in UTF-8.
     */
    static function decode(str : string) : string {
        return Base64._decode_utf8(Base64._atob(str));
    }

    /* implementation */

    static const _btoaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    static const _atobTab = Base64._makeTable(Base64._btoaChars);
    static const _invalid = new RegExp("[^" + Base64._btoaChars + "]", "g");

    static function _makeTable(binary : string) : Map.<int> {
        var tab = new Map.<int>();
        for (var i = 0; i < binary.length; ++i) {
            tab[binary.charAt(i)] = i;
        }
        return tab;
    }

    static function _encode_utf8(str : string) : string {
        var s = "";
        StringUtil.forEachByte(str, function (c) {
            s += String.fromCharCode(c);
            return true;
        });
        return s;
    }

    static function _btoa(bin : string) : string {
        var a = "";
        for (var i = 0; i < bin.length; i += 3) {
            var c = bin.slice(i, i+3);
            switch (c.length) {
            case 1:
                var ord = (c.charCodeAt(0) << 16);
                a += Base64._btoaChars.charAt( ord >>> 18)
                   + Base64._btoaChars.charAt((ord >>> 12) & 63)
                   + "==";
                break;
            case 2:
                var ord = (c.charCodeAt(0) << 16)
                        | (c.charCodeAt(1) <<  8);
                a += Base64._btoaChars.charAt( ord >>> 18)
                   + Base64._btoaChars.charAt((ord >>> 12) & 63)
                   + Base64._btoaChars.charAt((ord >>>  6) & 63)
                   + "=";
                break;
            default:
                var ord = (c.charCodeAt(0) << 16)
                        | (c.charCodeAt(1) <<  8)
                        |  c.charCodeAt(2);
                a += Base64._btoaChars.charAt( ord >>> 18)
                   + Base64._btoaChars.charAt((ord >>> 12) & 63)
                   + Base64._btoaChars.charAt((ord >>>  6) & 63)
                   + Base64._btoaChars.charAt( ord         & 63);
                break;
            }
        }
        return a;
    }

    static function _decode_utf8(utf8str : string) : string {
        var ustr = "";
        for (var i = 0; i < utf8str.length;) {
            var c = utf8str.charCodeAt(i);

            if (c < 0x80) {
                ustr += String.fromCharCode(c);
                i += 1;
            }
            else if (c < 0xE0) { // 2 bytes
                ustr += String.fromCharCode(
                    ((c & 0x1F) << 6)
                    | (utf8str.charCodeAt(i+1) & 0x3F)
                );
                i += 2;
            }
            else if (c < 0xF0) { // 3 bytes
                ustr += String.fromCharCode(
                    ((c & 0x0F)                         << 12)
                    | ((utf8str.charCodeAt(i+1) & 0x3F) <<  6)
                    |  (utf8str.charCodeAt(i+2) & 0x3F)
                );
                i += 3;
            }
            else { // 4 bytes
                var u = (
                    ((c & 0x07)                         << 18)
                    | ((utf8str.charCodeAt(i+1) & 0x3F) << 12)
                    | ((utf8str.charCodeAt(i+2) & 0x3F) <<  6)
                    |  (utf8str.charCodeAt(i+3) & 0x3F)
                );

                var surrogate = u - 0x10000;
                ustr += String.fromCharCode(
                        ((surrogate >>> 10) & 0x03FF) | 0xD800,
                        ( surrogate         & 0x03FF) | 0xDC00
                );

                i += 4;
            }
        }
        return ustr;
    }

    static function _atob(str : string) : string {
        var src = str.replace(Base64._invalid, "");
        var b = "";
        for (var i = 0; i < src.length; i += 4) {
            var c = src.slice(i, i+4);
            switch (c.length) {
            case 1:
                var ord = (Base64._atobTab[c.charAt(0)] << 18);
                b += String.fromCharCode( ord >>> 16,
                                         (ord >>>  8) & 0xFF,
                                          ord         & 0xFF);
                break;
            case 2:
                var ord = (Base64._atobTab[c.charAt(0)] << 18)
                        | (Base64._atobTab[c.charAt(1)] << 12);
                var s = String.fromCharCode( ord >>> 16,
                                            (ord >>>  8) & 0xFF,
                                             ord         & 0xFF);
                b += s.slice(0, 1);
                break;
            case 3:
                var ord = (Base64._atobTab[c.charAt(0)] << 18)
                        | (Base64._atobTab[c.charAt(1)] << 12)
                        | (Base64._atobTab[c.charAt(2)] <<  6);
                var s = String.fromCharCode( ord >>> 16,
                                            (ord >>>  8) & 0xFF,
                                             ord         & 0xFF);
                b += s.slice(0, 2);
                break;
            default:
                var ord = (Base64._atobTab[c.charAt(0)] << 18)
                        | (Base64._atobTab[c.charAt(1)] << 12)
                        | (Base64._atobTab[c.charAt(2)] <<  6)
                        |  Base64._atobTab[c.charAt(3)];
                b += String.fromCharCode( ord >>> 16,
                                         (ord >>>  8) & 0xFF,
                                          ord         & 0xFF);
                break;
            }
        }
        return b;
    }
}
// vim: set expandtab:
