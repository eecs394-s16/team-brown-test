all: clean install connect

clean:
	rm -rf node_modules
	rm -rf bower_components
	rm -rf mobile/node_modules
	rm -rf mobile/bower_components

install:
	npm install
	bower install
	(cd mobile && npm install)
	(cd mobile && bower install)

connect:
	(cd mobile && \
		steroids connect \
			--watch=../src \
			--livereload \
			--simulate)
