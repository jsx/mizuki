import "mizuki/posix.jsx";
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
		this.expect(POSIX.strftime(d, "%Y-%m-%d %H:%M:%S"))
			.toBe("2013-05-02 06:08:09");

	}

	function testLocale() : void {
		var d = this.date();

		this.expect(POSIX.strftime(d, "[%A]", "en")).toBe("[Thursday]");
		this.expect(POSIX.strftime(d, "[%A]", "ja")).toBe("[木曜日]");
		this.expect(POSIX.strftime(d, "[%A]", "NA"), "undefined locale is fallback to en").toBe("[Thursday]");
	}

	function testFormat() : void {
		var date = this.date();
		this.expect(POSIX.strftime(date, "[%A]"), "%A").toBe("[Thursday]");
		this.expect(POSIX.strftime(date, "[%a]"), "%a").toBe("[Thu]");
		this.expect(POSIX.strftime(date, "[%B]"), "%B").toBe("[May]");
		this.expect(POSIX.strftime(date, "[%b]"), "%b").toBe("[May]");
		this.expect(POSIX.strftime(date, "[%C]"), "%C").toBe("[20]");
		this.expect(POSIX.strftime(date, "[%D]"), "%D").toBe("[05/02/13]");
		this.expect(POSIX.strftime(date, "[%d]"), "%d").toBe("[02]");
		this.expect(POSIX.strftime(date, "[%e]"), "%e").toBe("[ 2]");
		this.expect(POSIX.strftime(date, "[%F]"), "%F").toBe("[2013-05-02]");
		this.expect(POSIX.strftime(date, "[%G]"), "%G").toBe("[2013]");
		this.expect(POSIX.strftime(date, "[%g]"), "%g").toBe("[13]");
		this.expect(POSIX.strftime(date, "[%H]"), "%H").toBe("[06]");
		this.expect(POSIX.strftime(date, "[%h]"), "%h").toBe("[May]");
		this.expect(POSIX.strftime(date, "[%I]"), "%I").toBe("[06]");
		this.expect(POSIX.strftime(date, "[%j]"), "%j").toBe("[122]");
		this.expect(POSIX.strftime(date, "[%k]"), "%k").toBe("[ 6]");
		this.expect(POSIX.strftime(date, "[%l]"), "%l").toBe("[ 6]");
		this.expect(POSIX.strftime(date, "[%M]"), "%M").toBe("[08]");
		this.expect(POSIX.strftime(date, "[%m]"), "%m").toBe("[05]");
		this.expect(POSIX.strftime(date, "[%n]"), "%n").toBe("[\n]");
		this.expect(POSIX.strftime(date, "[%p]"), "%p").toBe("[AM]");
		this.expect(POSIX.strftime(date, "[%P]"), "%P").toBe("[am]");
		this.expect(POSIX.strftime(date, "[%R]"), "%R").toBe("[06:08]");
		this.expect(POSIX.strftime(date, "[%r]"), "%r").toBe("[06:08:09 AM]");
		this.expect(POSIX.strftime(date, "[%S]"), "%S").toBe("[09]");
		var epoch = (date.getTime() / 1000) as int;// - date.getTimezoneOffset() * 60;
		this.expect(POSIX.strftime(date, "[%s]"), "%s").toBe("[" + epoch as string +"]");
		this.expect(POSIX.strftime(date, "[%T]"), "%T").toBe("[06:08:09]");
		this.expect(POSIX.strftime(date, "[%t]"), "%t").toBe("[\t]");
		this.expect(POSIX.strftime(date, "[%U]"), "%U").toBe("[18]");
		this.expect(POSIX.strftime(date, "[%u]"), "%u").toBe("[4]");
		//this.expect(POSIX.strftime(date, "[%V]"), "%V").toBe("[]");
		this.expect(POSIX.strftime(date, "[%v]"), "%v").toBe("[ 2-May-2013]");
		//this.expect(POSIX.strftime(date, "[%W]"), "%W").toBe("[]");
		this.expect(POSIX.strftime(date, "[%w]"), "%w").toBe("[4]");
		this.expect(POSIX.strftime(date, "[%Y]"), "%Y").toBe("[2013]");
		this.expect(POSIX.strftime(date, "[%y]"), "%y").toBe("[13]");

		this.expect(POSIX.strftime(date, "[%%]"), "%%").toBe("[%]");
	}

	function testVaryByEnv() : void {
		this.expect(POSIX.strftime(this.date(), "[%c]"), "%c").notToBe("");
		this.expect(POSIX.strftime(this.date(), "[%X]"), "%X").notToBe("");
		this.expect(POSIX.strftime(this.date(), "[%x]"), "%x").notToBe("");
		this.expect(POSIX.strftime(this.date(), "[%Z]"), "%Z").notToBe("");
		this.expect(POSIX.strftime(this.date(), "[%z]"), "%z").notToBe("");

		this.note("c: " + POSIX.strftime(this.date(), "[%c]"));
		this.note("X: " + POSIX.strftime(this.date(), "[%X]"));
		this.note("x: " + POSIX.strftime(this.date(), "[%x]"));
		this.note("Z: " + POSIX.strftime(this.date(), "[%Z]"));
		this.note("z: " + POSIX.strftime(this.date(), "[%z]"));
	}

	// extension, not in POSIX standard
	function testN() : void {
		this.expect(POSIX.strftime(this.date(), "[%N]"), "%N").toBe("[077000000]");
		this.expect(POSIX.strftime(this.date(), "[%3N]"), "%3N").toBe("[077]");
		this.expect(POSIX.strftime(this.date(), "[%10N]"), "%10N").toBe("[0077000000]");
	}

	function testPadding() : void {
		this.expect(POSIX.strftime(this.date(), "%m"), "default").toBe("05");
		this.expect(POSIX.strftime(this.date(), "%-m"), "none (-)").toBe("5");
		this.expect(POSIX.strftime(this.date(), "%0m"), "zero (0)").toBe("05");
		this.expect(POSIX.strftime(this.date(), "%_m"), "space (_)").toBe(" 5");
	}

	function testWidth() : void {
		this.expect(POSIX.strftime(this.date(), "%3H"), "with field width").toBe("006");
		this.expect(POSIX.strftime(this.date(), "%03H"), "with field with, after flags").toBe("006");
		this.expect(POSIX.strftime(this.date(), "%010H"), "with field with, after flags").toBe("0000000006");
	}
}
