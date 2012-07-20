import "mizuki/datetime.jsx";
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
		var s = "2013/04/02 06:08:09";
		var f = "%Y/%m/%d %H:%M:%S";

		var d = DateTime.strptime(s, f);
		this.note(d.toString());

		this.expect(DateTime.strftime(d, f)).toBe(s);
	}

	function testLocale() : void {
		var d = this.date();

	}

	function testFormat() : void {

		this.expect(DateTime.strptime("[2012]", "[%Y]").getFullYear(), "%Y").toBe(2012);
		this.expect(DateTime.strptime("[12]", "[%y]").getFullYear(), "%y").toBe(2012);
	}
}
