
DETAIL = lib/mizuki/detail

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
	jsx --release --add-search-path lib --output a.jsx.js --executable node benchmark/sort.jsx
	node a.jsx.js
	js/spidermonkey a.jsx.js
	js/jscore a.jsx.js

benchmark-mt:
	jsx --release --add-search-path lib --output a.jsx.js --executable node benchmark/mt-vs-builtin.jsx
	node a.jsx.js
	js/spidermonkey a.jsx.js
	js/jscore a.jsx.js

