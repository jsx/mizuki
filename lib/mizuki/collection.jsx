
import "./utility.jsx";

/**
 * Associative collection that stores unique elements, or value-less map.
 *
 */

mixin ISet.<T> {
    abstract function clone() : ISet.<T>;

    abstract function create() : ISet.<T>;

    function create(values : T[]) : ISet.<T> {
        var set = this.create();
        set.insert(values);
        return set;
    }

    abstract function size() : int;

    abstract function toArray() : T[];

    abstract function contains(value : T) : boolean;

    // A | B
    function union(other : ISet.<T>) : ISet.<T> {
        var set = this.clone();
        set.insert(other);
        return set;
    }

    // A & B
    function intersection(other : ISet.<T>) : ISet.<T> {
        var set = this.create();
        this.forEach((item) -> {
            if (other.contains(item)) {
                set.insert(item);
            }
        });
        return set;
    }

    // A - B
    function difference(other : ISet.<T>) : ISet.<T> {
        var set = this.clone();
        set.remove(other);
        return set;
    }

    abstract function forEach (block : (T)->void) : void;

    // mutators

    abstract function clear() : void;

    abstract function insert(value : T) : void;

    function insert(values : T[]) : void {
        values.forEach((item) -> {
            this.insert(item);
        });
    }

    function insert(other : ISet.<T>) : void {
        other.forEach((item) -> {
            this.insert(item);
        });
    }

    abstract function remove(value : T) : void;

    function remove(values : T[]) : void {
        values.forEach((item) -> {
            this.remove(item);
        });
    }

    function remove(other: ISet.<T>) : void {
        other.forEach((item) -> {
            this.remove(item);
        });
    }

}

class Set.<T> implements ISet.<T> { // where T must be comparable
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

    override function size() : int {
        return this._set.length;
    }

    override function toArray() : T[] {
        return ArrayUtil.<T>.clone(this._set);
    }

    override function toString() : string {
        return "Set" + JSON.stringify(this._set);
    }

    override function clone() : Set.<T> {
        return new Set.<T>(this);
    }

    override function create() : Set.<T> {
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
    override function contains(value : T) : boolean {
        var index = this.lowerBound(value);
        return this._valueExistsAtIndex(index, value);
    }


    override function forEach (block : (T)->void) : void {
        this._set.forEach(function (value) {
            block(value);
        });
    }

    // mutators

    override function clear() : void {
        this._set.length = 0;
    }

    override function remove(value : T) : void {
        var index = ArrayUtil.<T>.lowerBound(this._set, value, this._cmp);
        if (this._valueExistsAtIndex(index, value)) {
            this._set.splice(index, 1);
        }
    }

    override function insert(value : T) : void {
        var index = ArrayUtil.<T>.lowerBound(this._set, value, this._cmp);
        var replace = this._valueExistsAtIndex(index, value);
        this._set.splice(index, replace ? 1 : 0, value);
    }

}

class StringSet implements ISet.<string> {
    var _map  = new Map.<boolean>;
    var _size = 0;

    function constructor() {
    }

    function constructor(values : string[]) {
        this.insert(values);
    }

    function constructor(set : StringSet) {
        this.insert(set);
    }

    override function clone() : StringSet {
        return new StringSet(this);
    }

    override function create() : StringSet {
        return new StringSet();
    }

    override function size() : int {
        return this._size;
    }

    override function toArray() : string[] {
        var a = new string[];
        this.forEach(function(item) {
            a.push(item);
        });
        return a;
    }

    override function contains(value : string) : boolean {
        return this._map.hasOwnProperty(value);
    }

    override function forEach(block : (string)->void) : void {
        for (var value in this._map) {
            block(value);
        }
    }

    override function clear() : void {
        this._map  = new Map.<boolean>;
        this._size = 0;
    }

    override function remove(value : string) : void {
        if (this._map.hasOwnProperty(value)) {
            this._size--;
            delete this._map[value];
        }
    }

    override function insert(value : string) : void {
        if (! this._map.hasOwnProperty(value)) {
            this._size++;
            this._map[value] = true;
        }
    }
}

// vim: set expandtab:
