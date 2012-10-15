import "../lib/mizuki/datetime.jsx";
import "test-case.jsx";

class Pair {
    var str : string;
    var fmt : string;

    function constructor(str : string, fmt : string) {
        this.str = str;
        this.fmt = fmt;
    }

    override function toString() : string {
        return "(" + this.str + ", " + this.fmt + ")";
    }
}

class _Test extends TestCase {
    function testSomke() : void {
        var s = "2013/04/02 06:08:09";
        var f = "%Y/%m/%d %H:%M:%S";

        var d = DateTime.strptime(s, f);
        this.note(d.toString());

        this.expect(DateTime.strftime(d, f)).toBe(s);

        d = new Date;
        f = "[%a %b %d %Y %H:%M:%S.%3N GMT%z (%Z)]";
        s = DateTime.strftime(d, f);
        this.expect(DateTime.strftime(DateTime.strptime(s, f), f), d.toString()).toBe(s);
    }

    function testFailure() : void {
        var data = [
            new Pair("[20121]", "[%Y]"),
            new Pair("[201]",   "[%Y]"),
            new Pair("[0]",  "[%m]"),
            new Pair("[13]", "[%m]"),
            new Pair("[0]",  "[%d]"),
            new Pair("[32]", "[%d]"),
            new Pair("[25]", "[%H]"),
            new Pair("[60]", "[%M]"),
            new Pair("[61]", "[%S]")
        ];

        data.forEach((p) -> {
            try {
                DateTime.strptime(p.str, p.fmt);
                this.fail("should not reached for " + p.toString());
            }
            catch (e : Error) {
                this.expect(e, p.toString() + " => " + e.toString()).notToBe(null);
            }
        });
    }

    function testLocale() : void {
        var s = "Sat Jul 21 00:52:33 2012";
        var f = "%a %b %d %H:%M:%S %Y";
        this.expect(DateTime.strftime(DateTime.strptime(s, f), f), f).toBe(s);


        this.expect(DateTime.strptime("[January]", "[%B]").getMonth(), "%B (1)").toBe(0);
        this.expect(DateTime.strptime("[february]", "[%B]").getMonth(), "%B (2)").toBe(1);
        this.expect(DateTime.strptime("[Jan]", "[%b]").getMonth(), "%b (1)").toBe(0);
        this.expect(DateTime.strptime("[feb]", "[%b]").getMonth(), "%b (2)").toBe(1);
    }

    function testFormat() : void {
        var data = [
            new Pair("[2012]", "[%Y]"),
            new Pair("[1970]", "[%Y]"),
            new Pair("[2060]", "[%Y]"),

            new Pair("[12]",  "[%y]"),
            new Pair("[95]",  "[%y]"),

            new Pair("[01]", "[%m]"),
            new Pair("[09]", "[%m]"),
            new Pair("[10]", "[%m]"),
            new Pair("[12]", "[%m]"),

            new Pair("[01]", "[%d]"),
            new Pair("[09]", "[%d]"),
            new Pair("[10]", "[%d]"),
            new Pair("[15]", "[%d]"),
            new Pair("[20]", "[%d]"),
            new Pair("[25]", "[%d]"),
            new Pair("[30]", "[%d]"),
            new Pair("[31]", "[%d]"),

            new Pair("[00]", "[%H]"),
            new Pair("[01]", "[%H]"),
            new Pair("[09]", "[%H]"),
            new Pair("[10]", "[%H]"),
            new Pair("[11]", "[%H]"),
            new Pair("[20]", "[%H]"),
            new Pair("[21]", "[%H]"),
            new Pair("[23]", "[%H]"),

            new Pair("[00]", "[%M]"),
            new Pair("[01]", "[%M]"),
            new Pair("[10]", "[%M]"),
            new Pair("[15]", "[%M]"),
            new Pair("[59]", "[%M]"),

            new Pair("[00]", "[%S]"),
            new Pair("[01]", "[%S]"),
            new Pair("[10]", "[%S]"),
            new Pair("[15]", "[%M]"),
            new Pair("[59]", "[%S]"),

            new Pair("[123]",       "[%3N]"),
            new Pair("[123000]",    "[%6N]"),
            new Pair("[123000000]", "[%9N]"),
            new Pair("[123000000]", "[%N]")
        ];

        data.forEach((p) -> {
            var d = DateTime.strptime(p.str, p.fmt);
            this.expect(DateTime.strftime(d, p.fmt), p.toString()).toBe(p.str);
        });
    }

    function testLeapSecond() : void {
        var a = "[Thu Dec 31 23:59:60 GMT 1998]";

        this.expect(DateTime.strptime(a, "[%a %b %d %H:%M:%S %Z %Y]").getTime()).toBe(915148800000);

        var b = "[2012-07-01T08:59:60Z]";
        this.expect(DateTime.strptime(b, "[%Y-%m-%dT%H:%M:%S%z]").getTime()).toBe(1341133200000);
    }
}

// vim: set expandtab:
