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

}


// vim: set expandtab:
