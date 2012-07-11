import "posix.jsx";
import "test-case.jsx";

class _Test extends TestCase {
	var year  = 2012;
	var month =   4;
	var day   =  12;
	var hour  =   6;
	var min   =  58;
	var sec   =   9;
	var ms    = 707;

	function date() : Date {
		return new Date(this.year, this.month, this.day, this.hour, this.min, this.sec, this.ms);
	}

	function testSomke() : void {
		this.expect(POSIX.strftime(this.date(), "%Y-%m-%d %H:%M:%S"))
			.toBe("2012-05-12 06:58:09");
	}
}
