import "../lib/mizuki/datetime.jsx";
import "test-case.jsx";

class _Test extends TestCase {
    var year  = 2013;
    var month =    4;
    var day   =    2;
    var hour  =    6;
    var min   =    8;
    var sec   =    9;
    var ms    =   77;

    var _date : Date = null;

    function date() : Date {
        return this._date ?: (this._date = new Date(this.year, this.month, this.day, this.hour, this.min, this.sec, this.ms));
    }

    function testSomke() : void {
        var d = this.date();

        this.note(d.toString());
        this.expect(DateTime.strftime(d, "%Y-%m-%d %H:%M:%S"))
            .toBe("2013-05-02 06:08:09");

    }

    function testISO8601() : void {
        var tz = DateTime.strftime(this.date(), "%z");
        this.expect(DateTime.strftime(this.date(), "[%c]"), "%c").toBe("[2013-05-02T06:08:09.077"+tz+"]");
    }

    function testLocale() : void {
        var d = this.date();

        this.expect(DateTime.strftime(d, "[%A]", "en")).toBe("[Thursday]");
        this.expect(DateTime.strftime(d, "[%A]", "ja")).toBe("[木曜日]");
        this.expect(DateTime.strftime(d, "[%A]", "ja_JP.utf8")).toBe("[木曜日]");
        this.expect(DateTime.strftime(d, "[%A]", "NA"), "undefined locale is fallback to en").toBe("[Thursday]");
    }

    function testFormat() : void {
        var date = this.date();
        this.expect(DateTime.strftime(date, "[%A]"), "%A").toBe("[Thursday]");
        this.expect(DateTime.strftime(date, "[%a]"), "%a").toBe("[Thu]");
        this.expect(DateTime.strftime(date, "[%B]"), "%B").toBe("[May]");
        this.expect(DateTime.strftime(date, "[%b]"), "%b").toBe("[May]");
        this.expect(DateTime.strftime(date, "[%C]"), "%C").toBe("[20]");
        this.expect(DateTime.strftime(date, "[%D]"), "%D").toBe("[05/02/13]");
        this.expect(DateTime.strftime(date, "[%d]"), "%d").toBe("[02]");
        this.expect(DateTime.strftime(date, "[%e]"), "%e").toBe("[ 2]");
        this.expect(DateTime.strftime(date, "[%F]"), "%F").toBe("[2013-05-02]");
        this.expect(DateTime.strftime(date, "[%G]"), "%G").toBe("[2013]");
        this.expect(DateTime.strftime(date, "[%g]"), "%g").toBe("[13]");
        this.expect(DateTime.strftime(date, "[%H]"), "%H").toBe("[06]");
        this.expect(DateTime.strftime(date, "[%h]"), "%h").toBe("[May]");
        this.expect(DateTime.strftime(date, "[%I]"), "%I").toBe("[06]");
        this.expect(DateTime.strftime(date, "[%j]"), "%j").toBe("[122]");
        this.expect(DateTime.strftime(date, "[%k]"), "%k").toBe("[ 6]");
        this.expect(DateTime.strftime(date, "[%l]"), "%l").toBe("[ 6]");
        this.expect(DateTime.strftime(date, "[%M]"), "%M").toBe("[08]");
        this.expect(DateTime.strftime(date, "[%m]"), "%m").toBe("[05]");
        this.expect(DateTime.strftime(date, "[%n]"), "%n").toBe("[\n]");
        this.expect(DateTime.strftime(date, "[%p]"), "%p").toBe("[AM]");
        this.expect(DateTime.strftime(date, "[%P]"), "%P").toBe("[am]");
        this.expect(DateTime.strftime(date, "[%R]"), "%R").toBe("[06:08]");
        this.expect(DateTime.strftime(date, "[%r]"), "%r").toBe("[06:08:09 AM]");
        this.expect(DateTime.strftime(date, "[%S]"), "%S").toBe("[09]");
        var epoch = (date.getTime() / 1000) as int;// - date.getTimezoneOffset() * 60;
        this.expect(DateTime.strftime(date, "[%s]"), "%s").toBe("[" + epoch as string +"]");
        this.expect(DateTime.strftime(date, "[%T]"), "%T").toBe("[06:08:09]");
        this.expect(DateTime.strftime(date, "[%t]"), "%t").toBe("[\t]");
        this.expect(DateTime.strftime(date, "[%U]"), "%U").toBe("[18]");
        this.expect(DateTime.strftime(date, "[%u]"), "%u").toBe("[4]");
        //this.expect(DateTime.strftime(date, "[%V]"), "%V").toBe("[]");
        this.expect(DateTime.strftime(date, "[%v]"), "%v").toBe("[ 2-May-2013]");
        //this.expect(DateTime.strftime(date, "[%W]"), "%W").toBe("[]");
        this.expect(DateTime.strftime(date, "[%w]"), "%w").toBe("[4]");
        this.expect(DateTime.strftime(date, "[%Y]"), "%Y").toBe("[2013]");
        this.expect(DateTime.strftime(date, "[%y]"), "%y").toBe("[13]");

        this.expect(DateTime.strftime(date, "[%%]"), "%%").toBe("[%]");
    }

    function testVaryByEnv() : void {
        this.expect(DateTime.strftime(this.date(), "[%X]"), "%X").notToBe("");
        this.expect(DateTime.strftime(this.date(), "[%x]"), "%x").notToBe("");
        this.expect(DateTime.strftime(this.date(), "[%Z]"), "%Z").notToBe("");
        this.expect(DateTime.strftime(this.date(), "[%z]"), "%z").notToBe("");

        this.note("X: " + DateTime.strftime(this.date(), "[%X]"));
        this.note("x: " + DateTime.strftime(this.date(), "[%x]"));
        this.note("Z: " + DateTime.strftime(this.date(), "[%Z]"));
        this.note("z: " + DateTime.strftime(this.date(), "[%z]"));
    }

    // extension, not in DateTime standard
    function testN() : void {
        this.expect(DateTime.strftime(this.date(), "[%N]"), "%N").toBe("[077000000]");
        this.expect(DateTime.strftime(this.date(), "[%3N]"), "%3N").toBe("[077]");
        this.expect(DateTime.strftime(this.date(), "[%10N]"), "%10N").toBe("[0077000000]");
    }

    function testPadding() : void {
        this.expect(DateTime.strftime(this.date(), "%m"), "default").toBe("05");
        this.expect(DateTime.strftime(this.date(), "%-m"), "none (-)").toBe("5");
        this.expect(DateTime.strftime(this.date(), "%0m"), "zero (0)").toBe("05");
        this.expect(DateTime.strftime(this.date(), "%_m"), "space (_)").toBe(" 5");
    }

    function testWidth() : void {
        this.expect(DateTime.strftime(this.date(), "%3H"), "with field width").toBe("006");
        this.expect(DateTime.strftime(this.date(), "%03H"), "with field with, after flags").toBe("006");
        this.expect(DateTime.strftime(this.date(), "%010H"), "with field with, after flags").toBe("0000000006");
    }
}

// vim: set expandtab:
