
import "./utility.jsx";

/**
 * Associative collection that stores unique elements, or value-less map.
 *
 */
class Set.<T> {
    var _set : T[];
    var _cmp : (Nullable.<T>, Nullable.<T>) -> int;

    function constructor(cmp : (Nullable.<T>, Nullable.<T>)->int) {
        assert cmp != null;

        this._set = new T[];
        this._cmp = cmp;
    }

    function constructor(a : T[], cmp : (Nullable.<T>, Nullable.<T>)->int) {
        this(cmp);

        assert a != null;
        this.insert(a);
    }

    function constructor(other :Set.<T>) {
        assert other != null;

        this._set = ArrayUtil.<T>.clone(other._set);
        this._cmp = other._cmp;
    }

    function size() : int {
        return this._set.length;
    }

    function toArray() : T[] {
        return ArrayUtil.<T>.clone(this._set);
    }

    function clone() : Set.<T> {
        return new Set.<T>(this);
    }

    function createEmptySet() : Set.<T> {
        return new Set.<T>(this._cmp);
    }

    function lowerBound(value : T) : int {
        return ArrayUtil.<T>.lowerBound(this._set, value, this._cmp);
    }

    function upperBound(value : T) : int {
        return ArrayUtil.<T>.upperBound(this._set, value, this._cmp);
    }

    function _valueExistsAtIndex(index : int, value : T) : boolean {
        return index < this.size() && this._cmp(this._set[index], value) == 0;
    }

    /*
     * Checks whether this set has a value with O(n log n) complexity.
     */
    function contains(value : T) : boolean {
        var index = this.lowerBound(value);
        return this._valueExistsAtIndex(index, value);
    }

    // A | B
    function union(other : Set.<T>) : Set.<T> {
        assert this._cmp == other._cmp;

        var set = this.clone();
        set.insert(other);
        return set;
    }

    // A & B
    function intersection(other : Set.<T>) : Set.<T> {
        assert this._cmp == other._cmp;

        var set = this.createEmptySet();
        this.forEach((item) -> {
            if (other.contains(item)) {
                set.insert(item);
            }
        });
        return set;
    }

    // A - B
    function difference(other : Set.<T>) : Set.<T> {
        assert this._cmp == other._cmp;

        var set = this.clone();
        set.remove(other);
        return set;
    }

    /* methods for mutable set */

    function clear() : void {
        this._set.length = 0;
    }

    function remove(value : T) : void {
        var index = ArrayUtil.<T>.lowerBound(this._set, value, this._cmp);
        if (this._valueExistsAtIndex(index, value)) {
            this._set.splice(index, 1);
        }
    }

    function remove(values : T[]) : void {
        values.forEach((item) -> {
            this.remove(item);
        });
    }

    function remove(other: Set.<T>) : void {
        other.forEach((item) -> {
            this.remove(item);
        });
    }

    function insert(value : T) : void {
        var index = ArrayUtil.<T>.lowerBound(this._set, value, this._cmp);
        var replace = this._valueExistsAtIndex(index, value);
        this._set.splice(index, replace ? 1 : 0, value);
    }

    function insert(values : T[]) : void {
        values.forEach((item) -> {
            this.insert(item);
        });
    }

    function insert(other : Set.<T>) : void {
        // TODO: performance should be improved
        other.forEach((item) -> {
            this.insert(item);
        });
    }

    // higher-order functions

    function forEach (block : (Nullable.<T>)->void) : void {
        this._set.forEach(block);
    }
}

// vim: set expandtab:
