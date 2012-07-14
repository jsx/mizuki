
all:
	mkdir -p lib/_utility
	perl tool/east-asian-width.pl > lib/_utility/east-asian-width.jsx
	jsx lib/_utility/east-asian-width.jsx > /dev/null # syntax check

test-all: test test-release

test:
	prove

test-release:
	JSX_OPTS=--release prove
