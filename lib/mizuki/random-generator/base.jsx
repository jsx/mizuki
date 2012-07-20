/**
    Abstract Random Generator
*/

mixin RandomGenerator {

    /**
     * generates an unsecure random seed
     *
     */
    function generateSeed() : int {
        var UINT32_MAX = 0xffffffff;

        var seed = Date.now();
        seed ^= Math.random() * UINT32_MAX;
        return seed;
    }

    /**
     * generates a random number on [0,0xffffffff]-interval
     * alias to nextInt32()
     */
     function nextInt() : number {
        return this.nextInt32();
     }

    /**
     * generates a random number on [0,1) with 53-bit resolution
     * alias to nextReal53()
     */
    function nextReal() : number {
        return this.nextReal53();
    }


    /**
     * generates a random number on [0,0xffffffff]-interval
     */
    abstract function nextInt32() : number;


    /**
     * generates a random number on [0,1)-real-interval
     */
    function nextReal32() : number {
        return this.nextInt32() * (1.0/4294967296.0); // devided by 2^32
    }

    /**
     * generates a random number on [0,1) with 53-bit resolution
     */
    function nextReal53() : number {
        var a = this.nextInt32() >>> 5;
        var b = this.nextInt32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }


    /**
     * generate a random number according to the standard normal distribution
     */
    function nextNormal() : number {
        return this.nextNormal(0, 1);
    }

    /**
     * generate a random number according to a normal distribution
     */
    function nextNormal(mean : number, deviation : number) : number {
        return 0;
    }


    /**
     * generate a 128-bit random ID
     * RFC 4211 complaint
     */
    function nextUUID() : string {
        var hex = function (n : int, l : int) : string {
            var str = n.toString(16);
            while (str.length < l) {
                str = "0" + str;
            }
            return str;
        };

        var nextUInt = function (bits : int) : int {
            assert 0 <= bits && bits <= 32;

            return this.nextInt32() >>> (32 - bits);
        };

        // 4.1.1. Variant
        var VARIANT = Number.parseInt("10", 2) << 14;

        // 4.1.3. Version
        // "The randomly or pseudo-randomly generated version"
        var VERSION = Number.parseInt("0100", 2) << 12;

        return hex(nextUInt(32), 8)
            + "-" + hex(nextUInt(16), 4)
            + "-" + hex(VERSION | nextUInt(12), 4)
            + "-" + hex(VARIANT | nextUInt(14), 4)
            + "-" + hex(nextUInt(32), 8) + hex(nextUInt(16), 4);
    }
}


// vim: set expandtab:
