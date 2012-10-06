import "js/web.jsx";
import "../lib/mizuki/utility.jsx";

class _Main {
    static function main(args : string[]) : void {
        var input = dom.id("input") as HTMLInputElement;

        input.addEventListener("keyup", (ev) -> {
            var value = input.value;
            dom.id("length").innerHTML = value.length as string;
            dom.id("charLength").innerHTML = StringUtil.charLength(value) as string;
            dom.id("byteLength").innerHTML = StringUtil.byteLength(value) as string;
            dom.id("visualWidth").innerHTML = StringUtil.visualWidth(value) as string;

        });
    }
}
// vim: set expandtab:
