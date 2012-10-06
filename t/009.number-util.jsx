import "test-case.jsx";
import "../lib/mizuki/utility.jsx";

class _Test extends TestCase {
	function testFormat2Arg() : void {
		this.expect(NumberUtil.format(0, 0)).toBe("0");
		this.expect(NumberUtil.format(0, 1)).toBe("0.0");
		this.expect(NumberUtil.format(0, 2)).toBe("0.00");

		this.expect(NumberUtil.format(10, 2)).toBe("10.00");
		this.expect(NumberUtil.format(3.1415, 2)).toBe("3.14");
		this.expect(NumberUtil.format(3.1415, 5)).toBe("3.14150");
	}

	function testFormat3Arg() : void {
		this.expect(NumberUtil.format(0, 0, 5)).toBe("    0");
		this.expect(NumberUtil.format(0, 1, 5)).toBe("  0.0");
		this.expect(NumberUtil.format(0, 2, 5)).toBe(" 0.00");

		this.expect(NumberUtil.format(10, 2, 10)    ).toBe("     10.00");
		this.expect(NumberUtil.format(3.1415, 2, 10)).toBe("      3.14");
		this.expect(NumberUtil.format(3.1415, 5, 10)).toBe("   3.14150");
	}
}
