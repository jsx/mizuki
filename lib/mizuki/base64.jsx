import "./utility.jsx";


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
        var a = "";
        for (var i = 0; i < bin.length; i += 3) {
            var c = bin.slice(i, i+3);
            switch (c.length) {
            case 1:
                var ord = (c.charCodeAt(0) << 16);
                a += Base64._b64chars.charAt( ord >>> 18)
                  + Base64._b64chars.charAt((ord >>> 12) & 63)
                  + "==";
                break;
            case 2:
                var ord = (c.charCodeAt(0) << 16)
                        | (c.charCodeAt(1) <<  8);
                a += Base64._b64chars.charAt( ord >>> 18)
                  + Base64._b64chars.charAt((ord >>> 12) & 63)
                  + Base64._b64chars.charAt((ord >>>  6) & 63)
                  + "=";
                break;
            default:
                var ord = (c.charCodeAt(0) << 16)
                        | (c.charCodeAt(1) <<  8)
                        |  c.charCodeAt(2);
                a += Base64._b64chars.charAt( ord >>> 18)
                  + Base64._b64chars.charAt((ord >>> 12) & 63)
                  + Base64._b64chars.charAt((ord >>>  6) & 63)
                  + Base64._b64chars.charAt( ord         & 63);
                break;
            }
        }
        return a;
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
