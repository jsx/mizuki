import "./utility.jsx";


final class Base64 {
    static function encode(str : string) : string {
        return Base64._btoa(Base64._encode_utf8(str));
    }

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
