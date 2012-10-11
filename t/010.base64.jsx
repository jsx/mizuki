import "../lib/mizuki/utility.jsx";
import "../lib/mizuki/base64.jsx";
import "../lib/mizuki/random/mt.jsx";
import "test-case.jsx";

class _Test extends TestCase {
    function testEncodeASCII() : void {
        this.expect(Base64.encode("")).toBe("");
        this.expect(Base64.encode("a")).toBe("YQ==");
        this.expect(Base64.encode("ab")).toBe("YWI=");
        this.expect(Base64.encode("abc")).toBe("YWJj");
        this.expect(Base64.encode("abcd")).toBe("YWJjZA==");
    }

    function testEncodeBinary() : void {
        this.expect(Base64.encode("\0")).toBe("AA==");
        this.expect(Base64.encode("\0\1")).toBe("AAE=");
        this.expect(Base64.encode("\0\1\2")).toBe("AAEC");
    }

    function testEncodeUnicode() : void {
        this.expect(Base64.encode("あ")).toBe("44GC");
        this.expect(Base64.encode("д")).toBe("0LQ=");
    }

    function testDecodeASCII() : void {
        this.expect(Base64.decode("")).toBe("");
        this.expect(Base64.decode("YQ==")).toBe("a");
        this.expect(Base64.decode("YWI=")).toBe("ab");
        this.expect(Base64.decode("YWJj")).toBe("abc");
        this.expect(Base64.decode("YWJjZA==")).toBe("abcd");
    }

    function testDecodeBinary() : void {
        this.expect(Base64.decode("AA==")).toBe("\0");
        this.expect(Base64.decode("AAE=")).toBe("\0\1");
        this.expect(Base64.decode("AAEC")).toBe("\0\1\2");
    }

    function testDecodeUnicode() : void {
        this.expect(Base64.decode("44GC")).toBe("あ");
        this.expect(Base64.decode("0LQ=")).toBe("д");
    }

    function testRandomString() : void {
        var r = new MT(0);

        for (var i = 0; i < 1000; ++i) {
            var len = r.nextInt32() % 100;

            var s = "";
            for (var j = 0; j < len; ++j) {
                s += String.fromCharCode(r.nextInt32());
            }

            var x = Base64.decode(Base64.encode(s));
            this.expect(x, "random string (len=" + (s.length as string) + ")").toBe(s);
        }
    }
}
// vim: set expandtab:
