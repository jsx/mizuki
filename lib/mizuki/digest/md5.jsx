/*
 * Original: JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 */
import "console.jsx";
import "../utility.jsx";

final class MD5 {
  static const _USE_SAFE_ADD = false;

  static function _add(x : number, y : number) : number {
    if (MD5._USE_SAFE_ADD) {
      // Adds integers, wrapping at 2^32. This uses 16-bit operations
      // internally to work around bugs in some JS interpreters.
      const lsw = (x & 0xFFFF) + (y & 0xFFFF);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    else {
      return x + y;
    }
  }

  // Bitwise rotate a 32-bit number to the left.
  static function _bit_rol(num : number, cnt : number) : number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  // These functions implement the four basic operations the algorithm uses.
  static function _cmn(q : number, a : number, b : number, x : number, s : number, t : number) : number {
    return MD5._add(MD5._bit_rol(MD5._add(MD5._add(a, q), MD5._add(x, t)), s), b);
  }
  static function _ff(a : number, b : number, c : number, d : number, x : Nullable.<number>, s : number, t : number) : number {
    return MD5._cmn((b & c) | ((~b) & d), a, b, x ?: 0, s, t);
  }
  static function _gg(a : number, b : number, c : number, d : number, x : Nullable.<number>, s : number, t : number) : number {
    return MD5._cmn((b & d) | (c & (~d)), a, b, x ?: 0, s, t);
  }
  static function _hh(a : number, b : number, c : number, d : number, x : Nullable.<number>, s : number, t : number) : number {
    return MD5._cmn(b ^ c ^ d, a, b, x ?: 0, s, t);
  }
  static function _ii(a : number, b : number, c : number, d : number, x : Nullable.<number>, s : number, t : number) : number {
    return MD5._cmn(c ^ (b | (~d)), a, b, x ?: 0, s, t);
  }

  // Calculates the MD5 of an array of little-endian words, and a bit length.
  static function _binl_md5(x : number[], len : number) : number[] {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b =  -271733879;
    var c = -1732584194;
    var d =   271733878;

    for (var i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;

      a = MD5._ff(a, b, c, d, x[i],       7, -680876936);
      d = MD5._ff(d, a, b, c, x[i +  1], 12, -389564586);
      c = MD5._ff(c, d, a, b, x[i +  2], 17,  606105819);
      b = MD5._ff(b, c, d, a, x[i +  3], 22, -1044525330);
      a = MD5._ff(a, b, c, d, x[i +  4],  7, -176418897);
      d = MD5._ff(d, a, b, c, x[i +  5], 12,  1200080426);
      c = MD5._ff(c, d, a, b, x[i +  6], 17, -1473231341);
      b = MD5._ff(b, c, d, a, x[i +  7], 22, -45705983);
      a = MD5._ff(a, b, c, d, x[i +  8],  7,  1770035416);
      d = MD5._ff(d, a, b, c, x[i +  9], 12, -1958414417);
      c = MD5._ff(c, d, a, b, x[i + 10], 17, -42063);
      b = MD5._ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = MD5._ff(a, b, c, d, x[i + 12],  7,  1804603682);
      d = MD5._ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = MD5._ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = MD5._ff(b, c, d, a, x[i + 15], 22,  1236535329);

      a = MD5._gg(a, b, c, d, x[i +  1],  5, -165796510);
      d = MD5._gg(d, a, b, c, x[i +  6],  9, -1069501632);
      c = MD5._gg(c, d, a, b, x[i + 11], 14,  643717713);
      b = MD5._gg(b, c, d, a, x[i],      20, -373897302);
      a = MD5._gg(a, b, c, d, x[i +  5],  5, -701558691);
      d = MD5._gg(d, a, b, c, x[i + 10],  9,  38016083);
      c = MD5._gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = MD5._gg(b, c, d, a, x[i +  4], 20, -405537848);
      a = MD5._gg(a, b, c, d, x[i +  9],  5,  568446438);
      d = MD5._gg(d, a, b, c, x[i + 14],  9, -1019803690);
      c = MD5._gg(c, d, a, b, x[i +  3], 14, -187363961);
      b = MD5._gg(b, c, d, a, x[i +  8], 20,  1163531501);
      a = MD5._gg(a, b, c, d, x[i + 13],  5, -1444681467);
      d = MD5._gg(d, a, b, c, x[i +  2],  9, -51403784);
      c = MD5._gg(c, d, a, b, x[i +  7], 14,  1735328473);
      b = MD5._gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = MD5._hh(a, b, c, d, x[i +  5],  4, -378558);
      d = MD5._hh(d, a, b, c, x[i +  8], 11, -2022574463);
      c = MD5._hh(c, d, a, b, x[i + 11], 16,  1839030562);
      b = MD5._hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = MD5._hh(a, b, c, d, x[i +  1],  4, -1530992060);
      d = MD5._hh(d, a, b, c, x[i +  4], 11,  1272893353);
      c = MD5._hh(c, d, a, b, x[i +  7], 16, -155497632);
      b = MD5._hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = MD5._hh(a, b, c, d, x[i + 13],  4,  681279174);
      d = MD5._hh(d, a, b, c, x[i],      11, -358537222);
      c = MD5._hh(c, d, a, b, x[i +  3], 16, -722521979);
      b = MD5._hh(b, c, d, a, x[i +  6], 23,  76029189);
      a = MD5._hh(a, b, c, d, x[i +  9],  4, -640364487);
      d = MD5._hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = MD5._hh(c, d, a, b, x[i + 15], 16,  530742520);
      b = MD5._hh(b, c, d, a, x[i +  2], 23, -995338651);

      a = MD5._ii(a, b, c, d, x[i],       6, -198630844);
      d = MD5._ii(d, a, b, c, x[i +  7], 10,  1126891415);
      c = MD5._ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = MD5._ii(b, c, d, a, x[i +  5], 21, -57434055);
      a = MD5._ii(a, b, c, d, x[i + 12],  6,  1700485571);
      d = MD5._ii(d, a, b, c, x[i +  3], 10, -1894986606);
      c = MD5._ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = MD5._ii(b, c, d, a, x[i +  1], 21, -2054922799);
      a = MD5._ii(a, b, c, d, x[i +  8],  6,  1873313359);
      d = MD5._ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = MD5._ii(c, d, a, b, x[i +  6], 15, -1560198380);
      b = MD5._ii(b, c, d, a, x[i + 13], 21,  1309151649);
      a = MD5._ii(a, b, c, d, x[i +  4],  6, -145523070);
      d = MD5._ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = MD5._ii(c, d, a, b, x[i +  2], 15,  718787259);
      b = MD5._ii(b, c, d, a, x[i +  9], 21, -343485551);

      a = MD5._add(a, olda);
      b = MD5._add(b, oldb);
      c = MD5._add(c, oldc);
      d = MD5._add(d, oldd);
    }
    return [a, b, c, d];
  }

  // Converts an array of little-endian words to a string
  static function _binl2rstr(input : number[]) : string {
    var output = '';
    for (var i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }

  // Converts a raw string to an array of little-endian words
  // Characters >255 have their high-byte silently ignored.
  static function _rstr2binl(input : string) : number[] {
    var output = new number[];
    output[(input.length >> 2) - 1] = null;
    for (var i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    for (var i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }

  // Calculates the MD5 of a raw string
  static function _rstr_md5(s : string) : string {
    return MD5._binl2rstr(MD5._binl_md5(MD5._rstr2binl(s), s.length * 8));
  }

  static function _rstr2hex(input : string) : string {
    const hex = '0123456789abcdef';
    var output = '';
    for (var i = 0; i < input.length; i += 1) {
      const x = input.charCodeAt(i);
      output += hex.charAt((x >>> 4) & 0x0F) + hex.charAt(x & 0x0F);
    }
    return output;
  }

  /**
   * Returns the raw MD5 digest of the argument.
   * If the argument includes wide-characters (a.k.a. multi-byte string),
   * it will be encoded to UTF-8 binaries first.
   */
  static function raw(str : string) : string {
    return MD5._rstr_md5(StringUtil.encode_utf8(str));
  }

  /**
   * Returns the hex encoded MD5 digest of the argument.
   * If the argument includes wide-characters (a.k.a. multi-byte string),
   * it will be encoded to UTF-8 binaries first.
   */
  static function hex(str : string) : string {
    return MD5._rstr2hex(MD5.raw(str));
  }
}

class _Main {
  static function main(argv : string[]) : void {
    console.log(MD5.hex(argv.join()));
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:
