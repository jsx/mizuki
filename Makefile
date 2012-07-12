
JSX := jsx

all:

test-all: test test-release

test:
	prove

test-release:
	JSX_OPTS=--release prove
