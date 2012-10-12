import "../lib/mizuki/utility.jsx";
import "test-case.jsx";

class _Test extends TestCase {
    var ascii = [
        ["", ""],
        ["ab", "YWI="],
        ["abc", "YWJj"],
        ["abcd", "YWJjZA=="],
        ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ .*-~!\~,$%&(){}[]",
         "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyAuKi1+IX4sJCUmKCl7fVtd"],
         ["foo\nbar", "Zm9vCmJhcg=="]
    ];

    var binary = [
        ["\0", "AA=="],
        ["\0\1", "AAE="],
        ["\0\1\2", "AAEC"],
        ["\0abc", "AGFiYw=="]
    ];

    var unicode = [
        ["あ", "44GC"],
        ["©", "wqk="],
        ["д", "0LQ="],
        ["αβγ", "zrHOss6z"],
        ["薔薇ばらバラ", "6JaU6JaH44Gw44KJ44OQ44Op"],
        ["𠮟", "8KCunw=="],              // surrogate pairs
        ["--𪘚𪘚--", "LS3wqpia8KqYmi0t"] // surrogate pairs
    ];

    function testEncodeASCII() : void {
        this.ascii.forEach((item) -> {
            this.expect(Base64.encode(item[0])).toBe(item[1]);
        });
    }

    function testEncodeBinary() : void {
        this.binary.forEach((item) -> {
            this.expect(Base64.encode(item[0])).toBe(item[1]);
        });
    }

    function testEncodeUnicode() : void {
        this.unicode.forEach((item) -> {
            this.expect(Base64.encode(item[0])).toBe(item[1]);
        });
    }

    function testDecodeASCII() : void {
        this.ascii.forEach((item) -> {
            this.expect(Base64.decode(item[1])).toBe(item[0]);
        });
    }

    function testDecodeBinary() : void {
        this.binary.forEach((item) -> {
            this.expect(Base64.decode(item[1])).toBe(item[0]);
        });
    }

    function testDecodeUnicode() : void {
        this.unicode.forEach((item) -> {
            this.expect(Base64.decode(item[1])).toBe(item[0]);
        });
    }

    function testDecodeWithSpaces() : void {
        this.expect(Base64.decode("Y W J \n j Z A = =")).toBe("abcd");
    }
}
// vim: set expandtab:
