import "test-case.jsx";
import "mizuki/utility.jsx";

class _Test extends TestCase {
	function testVisualWidth() : void {
		this.expect(StringUtil.visualWidth("foo")).toBe(3);
		this.expect(StringUtil.visualWidth("漢字")).toBe(4);
		this.expect(StringUtil.visualWidth("ひらがな")).toBe(8);
		this.expect(StringUtil.visualWidth("カタカナ")).toBe(8);
		this.expect(StringUtil.visualWidth("ﾊﾝｶｸｶﾀｶﾅ")).toBe(8);
		this.expect(StringUtil.visualWidth("叱")).toBe(2); // uses surrogate pairs
		this.expect(StringUtil.visualWidth("１２")).toBe(4);
		this.expect(StringUtil.visualWidth("ｘｙ")).toBe(4);
	}

	function testTruncate() : void {
		this.expect(StringUtil.truncate("foo",   4, "..")).toBe("foo");
		this.expect(StringUtil.truncate("foooo", 4, "..")).toBe("fo..");
		this.expect(StringUtil.truncate("あいうえお", 4, "..")).toBe("あ..");

		this.expect(StringUtil.truncate("代々木 9-9-9 ギャラクシーハイツ 999", 20, "..")).toBe("代々木 9-9-9 ギャ..");
		this.expect(StringUtil.truncate("代々木 9-9-9 ギャラクシーハイツ 999", 20, "")).toBe("代々木 9-9-9 ギャラ");
	}

	function testCompare() : void {
		this.expect(StringUtil.compare("aaa", "bbb")).toBeLT(0);
		this.expect(StringUtil.compare("bbb", "aaa")).toBeGT(0);
		this.expect(StringUtil.compare("aaa", "aaa")).toBe(0);

		this.expect(StringUtil.compare("aaa", "AAA")).toBeGT(0);
	}

	function testCompareIgnoreCase() : void {
		this.expect(StringUtil.compareIgnoreCase("aaa", "bbb")).toBeLT(0);
		this.expect(StringUtil.compareIgnoreCase("bbb", "aaa")).toBeGT(0);
		this.expect(StringUtil.compareIgnoreCase("aaa", "aaa")).toBe(0);

		this.expect(StringUtil.compareIgnoreCase("aaa", "AAA")).toBe(0);
	}

	function testRepeat() : void {
		this.expect(StringUtil.repeat("a", 3)).toBe("aaa");
		this.expect(StringUtil.repeat("a", 0)).toBe("");
		this.expect(StringUtil.repeat("ab", 2)).toBe("abab");
	}
}
