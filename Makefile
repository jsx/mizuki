
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
	if which js ; then js -m -j -f js/nodelike.js a.jsx.js; fi
	if which nore ; then  nore a.jsx.js ; fi

benchmark-mt:
	jsx --release --add-search-path lib --output a.jsx.js --executable node benchmark/mt-vs-builtin.jsx
	node a.jsx.js
	if which js ; then js -m -j -f js/nodelike.js a.jsx.js; fi
	if which nore ; then  nore a.jsx.js ; fi

