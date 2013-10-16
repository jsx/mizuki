import "test-case.jsx";
import "../lib/mizuki/digest/md5.jsx";

class _Test extends TestCase {
  function testHexBasic() : void {
    this.expect(MD5.hex("value")).toBe("2063c1608d6e0baf80249c42e2be5804");
  }
  function testHMacHexBasic() : void {
    this.expect(MD5.hex_hmac("key", "value")).toBe("01433efd5f16327ea4b31144572c67f6");
  }

  function testHexForMultibytesStr() : void {
    this.expect(MD5.hex("foo こんにちは bar")).toBe("e4ae3ed0c5a6c39bac8fede2b7a4a20a");
  }
}
// vim: set tabstop=2 shiftwidth=2 expandtab:

