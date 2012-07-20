import "mizuki/random-generator/mt.jsx";
import "test-case.jsx";

class _Test extends TestCase {
	function testUUID() : void {
		var NameSpace_URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8"; // RFC 4122

		var r0 = new MT(0);

		var u0 = r0.nextUUID();
		var u1 = r0.nextUUID();
		var u2 = r0.nextUUID();
		var u3 = r0.nextUUID();
		var u4 = r0.nextUUID();

		this.expect(u0.length).toBe(NameSpace_URL.length);
		this.expect(u0).notToBe(NameSpace_URL);

		this.expect(u0.length).toBe(u1.length);
		this.expect(u0).notToBe(u1);

		this.expect(u0.length).toBe(u2.length);
		this.expect(u0).notToBe(u2);

		this.expect(u0.length).toBe(u3.length);
		this.expect(u0).notToBe(u3);

		this.expect(u0.length).toBe(u4.length);
		this.expect(u0).notToBe(u4);
	}
}
