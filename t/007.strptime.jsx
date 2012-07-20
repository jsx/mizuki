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

	function testFailure() : void {
		try {
			DateTime.strptime("2012", "[%Y]");
			this.fail("should not reached");
		}
		catch (e : Error) {
			this.expect(e, e.toString()).notToBe(null);
		}

		try {
			DateTime.strptime("[2012]", "%Y");
			this.fail("should not reached");
		}
		catch (e : Error) {
			this.expect(e, e.toString()).notToBe(null);
		}
	}

	function testLocale() : void {
		var s = "Sat Jul 21 00:52:33 JST 2012";
		var f = "%a %b %d %H:%M:%S %Z %Y";
		this.expect(DateTime.strftime(DateTime.strptime(s, f), f), f).toBe(s);


		this.expect(DateTime.strptime("[January]", "[%B]").getMonth(), "%B (1)").toBe(0);
		this.expect(DateTime.strptime("[february]", "[%B]").getMonth(), "%B (2)").toBe(1);
		this.expect(DateTime.strptime("[Jan]", "[%b]").getMonth(), "%b (1)").toBe(0);
		this.expect(DateTime.strptime("[feb]", "[%b]").getMonth(), "%b (2)").toBe(1);
	}

	function testFormat() : void {

		this.expect(DateTime.strptime("[2012]", "[%Y]").getFullYear(), "%Y").toBe(2012);
		this.expect(DateTime.strptime("[12]", "[%y]").getFullYear(), "%y (for 20xx)").toBe(2012);
		this.expect(DateTime.strptime("[99]", "[%y]").getFullYear(), "%y (for 19xx)").toBe(1999);

		this.expect(DateTime.strptime("[6]", "[%m]").getMonth(), "%m").toBe(5);
		this.expect(DateTime.strptime("[5]", "[%d]").getDate(), "%d").toBe(5);
	}
}
