/***
 * Stable Sort Implementation with TimSort
 *
 * TimSort is the algorithm used in Python and it has spred to other systems.
 *
 * @see http://svn.python.org/projects/python/trunk/Objects/listsort.txt description by the author
 * @see http://code.google.com/p/timsort/source/browse/trunk/timsort.c C port
 * @see http://cr.openjdk.java.net/~martin/webrevs/openjdk7/timsort/raw_files/new/src/share/classes/java/util/TimSort.java Java port
 */

import "./../utility.jsx";

class StableSort.<T> {

    static function sortInPlace(a : T[], begin : int, end : int, cmp :  (Nullable.<T>, Nullable.<T>) -> int) : void {
        assert begin <= end;
        assert begin >= 0;
        assert end <= a.length;

        var nRemaining = end - begin;
        if (nRemaining < 2) {
            return; // already sorted
        }

        if (nRemaining < StableSort.<T>.MIN_MERGE) {
            var initRunLen = StableSort.<T>._countRunAndMakeAscending(a, begin, end, cmp);
            StableSort.<T>._binarySort(a, begin, end, begin + initRunLen, cmp);
            return;
        }

        var context = new StableSort.<T>(a, cmp);
        context._runSort(begin, end);
    }

    function _runSort(begin : int, end : int) : void {
        var nRemaining = end - begin;

        var minRun = StableSort.<T>._minRunLength(nRemaining);
        do {
            var runLen = StableSort.<T>._countRunAndMakeAscending(this.a, begin, end, this.c);
            if (runLen < minRun) {
                var force = Math.min(nRemaining, minRun);
                StableSort.<T>._binarySort(this.a, begin, begin + force, begin + runLen, this.c);
                runLen = force;
            }

            this._pushRun(begin, runLen);
            this._mergeCollapse();

            begin      += runLen;
            nRemaining -= runLen;
        } while (nRemaining != 0);

        assert begin == end;
        this._mergeForceCollapse();
        assert this.stackSize == 1;
    }

    // back-end

    static const MIN_MERGE  = 64;
    static const MIN_GALLOP = 11;
    static const INITIAL_TMP_LENGTH = 256;

    var a : T[];
    var c : (Nullable.<T>, Nullable.<T>) -> int;

    var minGallop = StableSort.<T>.MIN_GALLOP;
    var tmp : T[];

    var stackSize = 0;
    var runBase = new int[];
    var runLen  = new int[];

    function constructor(a : T[], c : (Nullable.<T>, Nullable.<T>) -> int) {
        this.a = a;
        this.c = c;

        var initLen = Math.min(a.length >>> 1, StableSort.<T>.INITIAL_TMP_LENGTH);
        this.tmp = new T[](initLen);
    }

    static function _binarySort(a : T[], begin : int, end : int, start : int, cmp : (Nullable.<T>, Nullable.<T>) -> int) : void {
        assert begin <= start;
        assert start <= end;

        if (start == begin) {
            start++;
        }

        for (; start < end; ++start) {
            var pivot = a[start];
            var pos   = ArrayUtil.<T>.upperBound(a, begin, start, pivot, cmp);
            ArrayUtil.<T>.copyBackward(a, pos, a, pos + 1, start - pos);
            a[pos] = pivot;
        }
    }

    static function _countRunAndMakeAscending(a : T[], begin : int, end : int, cmp : (Nullable.<T>, Nullable.<T>) -> int) : int{
        assert begin < end;

        var runEnd = begin + 1;
        if (runEnd == end) {
            return 1;
        }

        if (cmp(a[runEnd++], a[begin]) < 0) {
            while (runEnd < end && cmp(a[runEnd], a[runEnd - 1]) < 0) {
                ++runEnd;
            }
            ArrayUtil.<T>.reverseInPlace(a, begin, runEnd);
        }
        else {
            while (runEnd < end && cmp(a[runEnd], a[runEnd - 1]) >= 0) {
                ++runEnd;
            }
        }
        return runEnd - begin;
    }

    static function _minRunLength(n : int) : int {
        assert n >= 0;
        var r = 0;
        while (n >= StableSort.<T>.MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    }

    function _pushRun(runBase : int, runLen : int) : void {
        var stackSize = this.stackSize++;
        this.runBase[stackSize] = runBase;
        this.runLen[stackSize]  = runLen;
    }

    function _mergeCollapse() : void {
        var runLen = this.runLen;

        while (this.stackSize > 1) {
            var n = this.stackSize - 2;
            if (n > 0 && runLen[n-1] <= runLen[n] + runLen[n+1]) {
                if (runLen[n-1] < runLen[n+1]) {
                    --n;
                }
                this._mergeAt(n);
            }
            else if (runLen[n] <= runLen[n+1]) {
                this._mergeAt(n);
            }
            else {
                break;
            }
        }
    }

    function _mergeForceCollapse() : void {
        var runLen = this.runLen;
        while (this.stackSize > 1) {
            var n = this.stackSize - 2;
            if (n > 0 && runLen[n-1] < runLen[n+1]) {
                --n;
            }
            this._mergeAt(n);
        }
    }

    function _mergeAt(i : int) : void {
        assert this.stackSize >= 2;
        assert i >= 0;
        assert i == (this.stackSize - 2) || i == (this.stackSize - 3);

        var a       = this.a;
        var c       = this.c;
        var runBase = this.runBase;
        var runLen  = this.runLen;

        var base1 = runBase[i];
        var len1  = runLen[i];
        var base2 = runBase[i+1];
        var len2  = runLen[i+1];
        assert len1 > 0 && len2 > 0;
        assert base1 + len1 == base2;

        runLen[i] = len1 + len2;
        if (i == this.stackSize - 3) {
            runBase[i+1] = runBase[i+2];
            runLen[i+1]  = runLen[i+2];
        }
        --this.stackSize;

        var k = StableSort.<T>._gallopRight(a[base2], a, base1, len1, 0, c);
        assert k >= 0;
        base1 += k;
        len1  -= k;
        if (len1 == 0) {
            return;
        }

        len2 = StableSort.<T>._gallopLeft(a[base1 + len1 - 1], a, base2, len2, len2 - 1, c);
        assert len2 >= 0;
        if (len2 == 0) {
            return;
        }

        if (len1 <= len2) {
            this._mergeLo(base1, len1, base2, len2);
        }
        else {
            this._mergeHi(base1, len1, base2, len2);
        }
    } // End of _mergeAt()

    static function _gallopLeft(key : T, a : T[], base : int, len : int, hint : int, cmp : (Nullable.<T>, Nullable.<T>) -> int) : int {
        assert len > 0;
        assert hint >= 0;
        assert hint < len;

        var ofs     = 1;
        var lastOfs = 0;
        if (cmp(key, a[base + hint]) > 0) {
            var maxOfs = len - hint;
            while (ofs < maxOfs && cmp(key, a[base + hint + ofs]) > 0) {
                lastOfs = ofs;
                ofs     = (ofs << 1) + 1;
            }
            if (ofs > maxOfs) {
                ofs = maxOfs;
            }

            lastOfs += hint;
            ofs     += hint;
        }
        else {
            var maxOfs = hint + 1;
            while (ofs < maxOfs && cmp(key, a[base + hint - ofs]) <= 0) {
                lastOfs = ofs;
                ofs     = (ofs << 1) + 1;
            }
            if (ofs > maxOfs) {
                ofs = maxOfs;
            }

            var tmp = lastOfs;
            lastOfs = hint - ofs;
            ofs     = hint - tmp;
        }
        assert -1 <= lastOfs && lastOfs < ofs && ofs <= len;
        ++lastOfs;
        return ArrayUtil.<T>.lowerBound(a, lastOfs+base, ofs+base, key, cmp) - base;
    }

    static function _gallopRight(key : T, a : T[], base : int, len : int, hint : int, cmp : (Nullable.<T>, Nullable.<T>) -> int) : int {
        assert len > 0;
        assert hint >= 0;
        assert hint < len;

        var ofs     = 1;
        var lastOfs = 0;
        if (cmp(key, a[base + hint]) >= 0) {
            var maxOfs = len - hint;
            while (ofs < maxOfs && cmp(key, a[base + hint + ofs]) >= 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
            }
            if (ofs > maxOfs) {
                ofs = maxOfs;
            }

            lastOfs += hint;
            ofs     += hint;
        }
        else {
            var maxOfs = hint + 1;
            while (ofs < maxOfs && cmp(key, a[base + hint - ofs]) < 0) {
                lastOfs = ofs;
                ofs     = (ofs << 1) + 1;
            }
            if (ofs > maxOfs) {
                ofs = maxOfs;
            }

            var tmp = lastOfs;
            lastOfs = hint - ofs;
            ofs     = hint - tmp;
        }
        assert -1 <= lastOfs && lastOfs < ofs && ofs <= len;

        ++lastOfs;
        return ArrayUtil.<T>.upperBound(a, lastOfs+base, ofs+base, key, cmp) - base;
    }

    function _mergeLo(base1 : int, len1 : int, base2 : int, len2 : int) : void {
        assert len1 > 0;
        assert len2 > 0;
        assert base1 + len1 == base2;

        var a   = this.a;
        var tmp = this.tmp;
        ArrayUtil.<T>.copyForward(a, base1, tmp, 0, len1);

        var cursor1 = 0;
        var cursor2 = base2;
        var dest    = base1;

        a[dest++] = a[cursor2++];
        if (--len2 == 0) {
            ArrayUtil.<T>.copyForward(tmp, cursor1, a, dest, len1);
            return;
        }
        if (len1 == 1) {
            ArrayUtil.<T>.copyForward(a, cursor2, a, dest, len2);
            a[dest + len2] = tmp[cursor1];
            return;
        }

        var cmp = this.c;
        var minGallop = this.minGallop;

        outer: while (true) {
            var count1 = 0;
            var count2 = 0;

            do {
                assert len1 > 1 && len2 > 0;
                if (cmp(a[cursor2], tmp[cursor1]) < 0) {
                    a[dest++] = a[cursor2++];
                    count2++;
                    count1 = 0;
                    if (--len2 == 0) {
                        break outer;
                    }
                }
                else {
                    a[dest++] = tmp[cursor1++];
                    count1++;
                    count2 = 0;
                    if (--len1 == 1) {
                        break outer;
                    }
                }
            } while ((count1 | count2) < minGallop);

            do {
                assert len1 > 1 && len2 > 0;
                count1 = StableSort.<T>._gallopRight(a[cursor2], tmp, cursor1, len1, 0, cmp);
                if (count1 != 0) {
                    ArrayUtil.<T>.copyBackward(tmp, cursor1, a, dest, count1);
                    dest    += count1;
                    cursor1 += count1;
                    len1    -= count1;
                    if (len1 <= 1) {
                        break outer;
                    }
                }
                a[dest++] = a[cursor2++];
                if (--len2 == 0) {
                    break outer;
                }

                count2 = StableSort.<T>._gallopLeft(tmp[cursor1], a, cursor2, len2, 0, cmp);
                if (count2 != 0) {
                    ArrayUtil.<T>.copyForward(a, cursor2, a, dest, count2);
                    dest    += count2;
                    cursor2 += count2;
                    len2    -= count2;
                    if (len2 == 0) {
                        break outer;
                    }
                }
                a[dest++] = tmp[cursor1++];
                if (--len1 == 1) {
                    break outer;
                }
                minGallop--;
            } while (count1 >= StableSort.<T>.MIN_GALLOP || count2 >= StableSort.<T>.MIN_GALLOP);
            if (minGallop < 0)
                minGallop = 0;
            minGallop += 2;
        }  // End of "outer" loop

        this.minGallop = Math.max(minGallop, 1);

        if (len1 == 1) {
            assert len2 > 0;
            ArrayUtil.<T>.copyForward(a, cursor2, a, dest, len2);
            a[dest + len2] = tmp[cursor1];
        }
        else {
            assert len2 == 0;
            assert len1 > 1;
            ArrayUtil.<T>.copyForward(tmp, cursor1, a, dest, len1);
        }
    } // End of _mergeLo()

    function _mergeHi(base1 : int, len1 : int, base2 : int, len2 : int) : void {
        assert len1 > 0;
        assert len2 > 0;
        assert base1 + len1 == base2;

        var a   = this.a;
        var tmp = this.tmp;
        ArrayUtil.<T>.copyForward(a, base2, tmp, 0, len2);

        var cursor1 = base1 + len1 - 1;
        var cursor2 = len2 - 1;
        var dest    = base2 + len2 - 1;

        a[dest--] = a[cursor1--];
        if (--len1 == 0) {
            ArrayUtil.<T>.copyForward(tmp, 0, a, dest - (len2 - 1), len2);
            return;
        }
        if (len2 == 1) {
            dest    -= len1;
            cursor1 -= len1;
            ArrayUtil.<T>.copyBackward(a, cursor1 + 1, a, dest + 1, len1);
            a[dest ] = tmp[cursor2];
            return;
        }

        var cmp = this.c;
        var minGallop = this.minGallop;

        outer: while (true) {
            var count1 = 0;
            var count2 = 0;

            do {
                assert len1 > 0 && len2 > 1;
                if (cmp(tmp[cursor2], a[cursor1]) < 0) {
                    a[dest--] = a[cursor1--];
                    count1++;
                    count2 = 0;
                    if (--len1 == 0) {
                        break outer;
                    }
                }
                else {
                    a[dest--] = tmp[cursor2--];
                    count2++;
                    count1 = 0;
                    if (--len2 == 1) {
                        break outer;
                    }
                }
            } while ((count1 | count2) < minGallop);

            do {
                assert len1 > 0 && len2 > 1;
                count1 = len1 - StableSort.<T>._gallopRight(tmp[cursor2], a, base1, len1, len1 - 1, cmp);
                if (count1 != 0) {
                    dest    -= count1;
                    cursor1 -= count1;
                    len1    -= count1;
                    ArrayUtil.<T>.copyBackward(a, cursor1 + 1, a, dest + 1, count1);
                    if (len1 == 0) {
                        break outer;
                    }
                }
                a[dest--] = tmp[cursor2--];
                if (--len2 == 1) {
                    break outer;
                }

                count2 = len2 - StableSort.<T>._gallopLeft(a[cursor1], tmp, 0, len2, len2 - 1, cmp);

                if (count2 != 0) {
                    dest    -= count2;
                    cursor2 -= count2;
                    len2    -= count2;
                    ArrayUtil.<T>.copyForward(tmp, cursor2 + 1, a, dest + 1, count2);
                    if (len2 <= 1) {
                        break outer;
                    }
                }
                a[dest--] = a[cursor1--];
                if (--len1 == 0) {
                    break outer;
                }
                --minGallop;
            } while (count1 >= StableSort.<T>.MIN_GALLOP || count2 >= StableSort.<T>.MIN_GALLOP);
            if (minGallop < 0)
                minGallop = 0;
            minGallop += 2;
        }  // End of "outer" loop

        this.minGallop = Math.max(minGallop, 1);

        if (len2 == 1) {
            assert len1 > 0;
            dest    -= len1;
            cursor1 -= len1;
            ArrayUtil.<T>.copyBackward(a, cursor1 + 1, a, dest + 1, len1);
            a[dest] = tmp[cursor2];
        }
        else {
            assert len1 == 0;
            assert len2 > 0;
            ArrayUtil.<T>.copyForward(tmp, 0, a, dest - (len2 - 1), len2);
        }
    } // End of _mergeHi()

}

// set vim: expandtab:
