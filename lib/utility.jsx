import "./_utility/east-asian-width.jsx";


class StringUtil {

    static function forEach(str : string, cb : function(c : int) : boolean) : void {
        function _surrogatePair(c : int) : boolean {
            return 0xD800 <= c && c <= 0xD8FF;
        }

        for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (_surrogatePair(c)) {
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

        var suffixWidth = StringUtil.visualWidth(suffix);

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
}

// vim: set expandtab:
