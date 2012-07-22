
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
	js/spidermonkey a.jsx.js
	js/jscore a.jsx.js

benchmark-mt:
	$(JSX2JS) benchmark/mt-vs-builtin.jsx
	node a.jsx.js
	js/spidermonkey a.jsx.js
	js/jscore a.jsx.js

benchmark-visual-width:
	$(JSX2JS) benchmark/visual-width.jsx
	node a.jsx.js
	js/spidermonkey a.jsx.js
	js/jscore a.jsx.js

