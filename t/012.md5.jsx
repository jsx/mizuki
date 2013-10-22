import "test-case.jsx";
import "../lib/mizuki/digest/md5.jsx";

class _Test extends TestCase {
  function testHexBasic() : void {
    this.expect(MD5.hex("value")).toBe("2063c1608d6e0baf80249c42e2be5804");
  }

  function testHexForMultibytesStr() : void {
    this.expect(MD5.hex("foo こんにちは bar")).toBe("e4ae3ed0c5a6c39bac8fede2b7a4a20a");
  }

  function testHexForUTF8mb4() : void {
    this.expect(MD5.hex("foo 𩸽 bar")).toBe("828cb5037ac2659cf0e30e5193ccadc7");
  }

  function testRFC1312() : void {
    this.expect(MD5.hex("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
    this.expect(MD5.hex("a")).toBe("0cc175b9c0f1b6a831c399e269772661");
    this.expect(MD5.hex("abc")).toBe("900150983cd24fb0d6963f7d28e17f72");
    this.expect(MD5.hex("message digest")).toBe("f96b697d7cb7938d525a2f31aaf161d0");
    this.expect(MD5.hex("abcdefghijklmnopqrstuvwxyz")).toBe("c3fcd3d76192e4007dfb496cca67e13b");
    this.expect(MD5.hex("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")).toBe("d174ab98d277d9f5a5611c2c9f419d9f");
    this.expect(MD5.hex("12345678901234567890123456789012345678901234567890123456789012345678901234567890")).toBe("57edf4a22be3c955ac49da2e2107b67a");
  }
}
// vim: set tabstop=2 shiftwidth=2 expandtab:

