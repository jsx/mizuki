
DETAIL = lib/mizuki/detail

JSX2JS =  jsx --release --add-search-path lib --output a.jsx.js --executable node

all:

east-asian-width:
	mkdir -p $(DETAIL)
	perl tool/east-asian-width.pl > $(DETAIL)/east-asian-width.jsx
	jsx $(DETAIL)/east-asian-width.jsx > /dev/null # syntax check

test-all: test test-release

test:
	prove

test-release:
	JSX_OPTS=--release prove

benchmark-sort:
	$(JSX2JS) benchmark/sort.js
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

