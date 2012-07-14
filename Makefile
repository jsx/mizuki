
DETAIL = lib/mizuki/detail

all:
	mkdir -p $(DETAIL)
	perl tool/east-asian-width.pl > $(DETAIL)/east-asian-width.jsx
	jsx $(DETAIL)/east-asian-width.jsx > /dev/null # syntax check

test-all: test test-release

test:
	prove

test-release:
	JSX_OPTS=--release prove

benchmark-sort:
	jsx --release --add-search-path lib --run benchmark/sort.jsx
