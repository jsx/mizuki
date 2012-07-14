
all:
	mkdir -p lib/detail
	perl tool/east-asian-width.pl > lib/detail/east-asian-width.jsx
	jsx lib/detail/east-asian-width.jsx > /dev/null # syntax check

test-all: test test-release

test:
	prove

test-release:
	JSX_OPTS=--release prove

benchmark-sort:
	jsx --release --add-search-path lib --run benchmark/sort.jsx
