
JOBS  := 2
PROVE :=prove --jobs=$(JOBS)

DETAIL = lib/mizuki/detail

JSX2JS = jsx --release --add-search-path lib --output a.jsx.js --executable node
all:

east-asian-width:
	mkdir -p $(DETAIL)
	perl tool/east-asian-width.pl > $(DETAIL)/east-asian-width.jsx
	jsx $(DETAIL)/east-asian-width.jsx > /dev/null # syntax check

test-all: test test-tz test-release

test:
	$(PROVE)


test-tz:
	TZ=GMT-0 $(PROVE)

test-release:
	JSX_OPTS=--release $(PROVE)

test-with-jscore:
	JSX_RUNJS=js/jscore $(PROVE)

benchmark-sort:
	$(JSX2JS) benchmark/sort.jsx
	node a.jsx.js
	js/jscore a.jsx.js

benchmark-mt:
	$(JSX2JS) benchmark/mt-vs-builtin.jsx
	node a.jsx.js
	js/jscore a.jsx.js

benchmark-visual-width:
	$(JSX2JS) benchmark/visual-width.jsx
	node a.jsx.js
	js/jscore a.jsx.js

benchmark-base64:
	$(JSX2JS) benchmark/base64.jsx
	node a.jsx.js
	js/jscore a.jsx.js

benchmark-all: print-version benchmark-sort benchmark-mt benchmark-visual-width benchmark-base64

print-version:
	uname --kernel-name --kernel-release --hardware-platform
	jsx --version
	node --version

note:
	make benchmark-all | tee `perl -MTime::Piece -e 'print( localtime()->strftime("note/%Y-%m-%d.txt") )'` note/latest.txt

.PHONY: note
