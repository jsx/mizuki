import "posix.jsx";
import "test-case.jsx";

class _Test extends TestCase {
	var year  = 2012;
	var month =   4;
	var day   =  12;
	var hour  =   6;
	var min   =  58;
	var sec   =   9;
	var ms    =  77;

	var _date : Date = null;

	function date() : Date {
		return this._date ?: (this._date = new Date(this.year, this.month, this.day, this.hour, this.min, this.sec, this.ms));
	}

	function testSomke() : void {
		var d = this.date();

		this.expect(POSIX.strftime(d, "%Y-%m-%d %H:%M:%S"))
			.toBe("2012-05-12 06:58:09");

	}

	function testLocale() : void {
		var d = this.date();

		this.expect(POSIX.strftime(d, "[%A]", "en")).toBe("[Saturday]");
		this.expect(POSIX.strftime(d, "[%A]", "ja")).toBe("[土曜日]");
		this.expect(POSIX.strftime(d, "[%A]", "NA"), "undefined locale is fallback to en").toBe("[Saturday]");
	}

	function testFormat() : void {
		this.expect(POSIX.strftime(this.date(), "[%A]"), "%A").toBe("[Saturday]");
		this.expect(POSIX.strftime(this.date(), "[%a]"), "%a").toBe("[Sat]");
		this.expect(POSIX.strftime(this.date(), "[%B]"), "%B").toBe("[May]");
		this.expect(POSIX.strftime(this.date(), "[%b]"), "%b").toBe("[May]");

		this.expect(POSIX.strftime(this.date(), "[%%]"), "%%").toBe("[%]");
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
