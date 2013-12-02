/**
 *  Abstract Random Generator
 */

mixin RandomGenerator {

    /**
     * Generates a random seed. Note that this is not secure.
     */
    function generateSeed() : number {
        const UINT32_MAX = 0xffffffff;

        var seed = Date.now();
        seed ^= Math.random() * UINT32_MAX;
        return seed;
    }

    /**
     * Generates a random number on [0,0xffffffff]-interval.
     * Alias to nextInt32().
     */
     function nextInt() : number {
        return this.nextInt32();
     }

    /**
     * Generates a random number on [0,1) with 53-bit resolution.
     * Alias to nextReal53().
     */
    function nextReal() : number {
        return this.nextReal53();
    }


    /**
     * Generates a random number on [0,0xffffffff]-interval.
     */
    abstract function nextInt32() : number;


    /**
     * Generates a random number on [0,1)-real-interval.
     */
    function nextReal32() : number {
        return this.nextInt32() * (1.0/4294967296.0); // devided by 2^32
    }

    /**
     * Generates a random number on [0,1) with 53-bit resolution.
     */
    function nextReal53() : number {
        const a = this.nextInt32() >>> 5;
        const b = this.nextInt32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }


    /**
     * Generates a random number according to the standard normal distribution (not yet implemented).
     */
    function nextNormal() : number {
        return this.nextNormal(0, 1);
    }

    /**
     * Generate a random number according to a normal distribution (not yet implemented).
     */
    function nextNormal(mean : number, deviation : number) : number {
        return 0;
    }

    function _hex(n : number, width : number) : string {
        var str = n.toString(16);
        while (str.length < width) {
            str = "0" + str;
        }
        return str;
    }

    function _nextUInt(bits : number) : number {
        assert 0 <= bits && bits <= 32;
        return this.nextInt32() >>> (32 - bits);
    }

    /**
     * Generates a 128-bit random string complaint version 4 of RFC 4122 UUID.
     * (random part is 122 bits).
     */
    function nextUUID() : string {
        // 4.1.1. Variant
        const VARIANT = 2; // 0b10 ("specified in this document")

        // 4.1.3. Version
        const VERSION = 4; // 0b100 ("The randomly or pseudo-randomly generated")

        const r0 = this._nextUInt(32);
        const r1 = this._nextUInt(16);
        const r2 = this._nextUInt(12) | (VERSION << 12);
        const r3 = this._nextUInt(14) | (VARIANT << 14);
        const r4 = this._nextUInt(32);
        const r5 = this._nextUInt(16);

        return this._hex(r0, 8)
            + "-" + this._hex(r1, 4)
            + "-" + this._hex(r2, 4)
            + "-" + this._hex(r3, 4)
            + "-" + this._hex(r4, 8) + this._hex(r5, 4);
    }
}


// vim: set expandtab:
