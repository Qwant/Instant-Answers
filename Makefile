# -----------------------------------------------------------------------------
# ENVIRONMENT
# -----------------------------------------------------------------------------
export SHELL                 = /bin/bash -ue
export COMPOSE_FILE         ?= docker/compose/${GITLAB_LOGIN}.yml
export COMPOSE_PROJECT_NAME ?= qwant
export ENVIRONMENT          ?= local
export UID                  ?= $(shell id --user)

# -----------------------------------------------------------------------------
# MAIN RECIPES
# -----------------------------------------------------------------------------
default: 			requirements docker.login dependencies
dependencies:		requirements npm.prune npm.install grunt.build
clean: 				requirements compose.down
npm.install: 		requirements npm npm.run.npm.install
npm.prune: 			requirements npm npm.run.npm.prune
npm.test:			requirements npm npm.run.npm.test
grunt.build: 		requirements grunt grunt.run.grunt.build

# -----------------------------------------------------------------------------
# RECIPES
# -----------------------------------------------------------------------------

#front:
#	${docker-compose} up --build --remove-orphans -d $$SITE
#
#api:
#	${docker-compose} up --remove-orphans -d api
#
#front.bash:
#	${docker-compose} run --rm $$SITE bash
#
#front.tests: docker.login dependencies grunt.build front
#	${docker-compose} run -T $$SITE /bin/tests
#
#sql:
#	docker-compose up -d sql
#
#phpmyadmin:
#	docker-compose up -d phpmyadmin
#
#back-office:
#	docker-compose up -d back-office
#
#proxy:
#	${docker-compose} up --remove-orphans -d proxy
#
#logs:
#	${docker-compose} logs --follow
#
#api.logs:
#	${docker-compose} logs --follow api
#
#wdio.run = ${docker-compose} run --rm --user $$UID:0 wdio
#
#export BASE_URL := $(shell ([ "${SITE}" = 'www' ] && echo "http://www.qwant.loc")       \
#                        || ([ "${SITE}" = 'edu' ] && echo "http://edu.qwantjunior.loc") \
#                        || ([ "${SITE}" = 'egp' ] && echo "http://www.qwantjunior.loc") )
#
#wdio: selenium
#	export CUCUMBER_TAGS="@$$SITE ~@failing";                         \
#	${wdio.run} ./node_modules/.bin/wdio --suite $$SITE
#
#wdio.basic: selenium
#	export CUCUMBER_TAGS="@$$SITE ~@failing";                   \
#	${wdio.run} ./node_modules/.bin/wdio --suite basic
#
#selenium:
#	${docker-compose} up -d --no-recreate firefox
#	${docker-compose} up -d selenium
#	${docker-compose} scale firefox=${FIREFOX_INSTANCES}
#	${docker-compose} exec -T selenium wait_all_done 30s
#
#selenium.run = ${docker-compose} run --rm --user $$UID:0 selenium
#
#selenium.test: selenium.ping selenium.curl.front selenium.curl.api
#
#selenium.ping: export hosts=www.qwant.loc api.qwant.loc mailer.qwant.loc
#selenium.ping:
#	${selenium.run} bash -c 'for host in ${hosts}; do ping -c 1 -w 10000 $$host; done'
#
#selenium.curl.front:
#	${selenium.run} curl ${BASE_URL}
#
#selenium.curl.api:
#	${selenium.run} curl api.qwant.loc/api/trend/get?locale=fr_FR
#
#selenium.stop:
#	${docker-compose} exec selenium stop || true
#	${docker-compose} stop selenium
npm: npm.build

npm.build:
	${docker-compose} build --pull npm

npm.run = ${docker-compose} run --rm --user $$UID:0 --name ${npm.name} npm

npm.name = ${COMPOSE_PROJECT_NAME}_npm_run_$(shell echo $$RANDOM)

#npm.healthcheck:
#	${npm.run} healthcheck
#
#npm.bash:
#	${npm.run} /bin/bash

npm.run.npm.install:
	${npm.run} npm install

npm.run.npm.prune:
	${npm.run} npm prune

npm.run.npm.test:
	${npm.run} npm test

grunt:
	${docker-compose} build --pull grunt

grunt.name = ${COMPOSE_PROJECT_NAME}_grunt_run_$(shell echo $$RANDOM)

grunt.run = ${docker-compose} run --rm --user $$UID:0 --name ${grunt.name} grunt

grunt.run.grunt.build:
	${grunt.run} grunt build
#
#grunt.run.grunt.build.common:
#	${grunt.run} grunt build:common
#
#grunt.run.grunt.build.core:
#	${grunt.run} grunt build:core
#
#grunt.run.grunt.watch:
#	${grunt.run} grunt watch --force
#
#grunt.test.unit:
#	${grunt.run} grunt test:unit
#
#grunt.i18n:
#	${grunt.run} grunt i18n:generate-dictionary
#
#grunt.healthcheck:
#	${grunt.run} healthcheck
#
compose.down:
	${docker-compose} down --remove-orphans --volumes

#composer: composer.build
#
#composer.build:
#	${docker-compose} build composer
#
#composer.run = ${docker-compose} run --rm --user $$UID:0 composer
#
#composer.install:
#	${composer.run} install --ignore-platform-reqs --optimize-autoloader
#
docker.login:
	docker login --username $$GITLAB_LOGIN --password $$GITLAB_TOKEN registry.qwant.ninja

#ps:
#	${docker-compose} ps
#
variables: export VARIABLES=ENVIRONMENT COMPOSE_FILE COMPOSE_PROJECT_NAME
variables:
	@echo
	@for name in ${VARIABLES};                  \
	do                                          \
		value=$$(eval 'echo $$'$$name);         \
		echo -e "  \e[33m$$name:\e[0m $$value"; \
	done
	@echo

requirements: variables ${COMPOSE_FILE}

compose_file.rm:
	rm --force ${COMPOSE_FILE}

${COMPOSE_FILE}:
	cp "docker/compose/template.yml" "${COMPOSE_FILE}"
	git add "${COMPOSE_FILE}"


## -----------------------------------------------------------------------------
## CI RECIPES
## -----------------------------------------------------------------------------
#ci.static_tests:			grunt.build check.build.information check.build.concatenation ci.lint.gherkin
#ci.unit_tests:      		grunt.build grunt.test.unit
#ci.functional_tests:		grunt.build selenium front api wdio.basic wdio selenium.stop
#ci.user_acceptance_tests:	compose.down ci.uat.build ci.uat.serve
#
#ci.lint.gherkin:
#	${docker-compose} run --rm npm npm run gherkin-lint -- --config tests/lint/gherkin/gherkin-lintrc `git ls-files | grep .feature`
#
#ci.uat.build: grunt.build ci.uat.sed
#	grep --quiet --recursive qwant.uat config
#
#ci.uat.serve: export BASE_URL := $(shell ([ "${SITE}" = 'www' ] && echo "http://www.qwant.uat")       \
#              				          || ([ "${SITE}" = 'edu' ] && echo "http://edu.qwantjunior.uat") \
#                        			  || ([ "${SITE}" = 'egp' ] && echo "http://www.qwantjunior.uat") )
#ci.uat.serve: front api proxy
#	source .gitlab-ci/lib/remote-search.sh && \
#	search for 'Qwant' at "$$BASE_URL" each 1s up to 10 times
#
#ci.uat.sed:
#	export FILES=$$(find public php configype f -name '*.js'                                \
#	                                            -o -name '*.php'                               \
#	                                            -o -name '*.yml'                               \
#	                                            -o -name '*.html'                              \
#	                                            -o -name '*.json');                            \
#	sed --regexp-extended 's:(qwant|qwantjunior)\.loc:\1.uat:g' $$FILES --in-place
#
#check.build.concatenation:
#	${npm.run} node --require coffee-script/register tests/build/constant_set.coffee
#
#check.build.information:
#	bash tests/build/information.sh
#
#
## -----------------------------------------------------------------------------
## PERSONAL RECIPES
## -----------------------------------------------------------------------------
#
## ----------
##  MAX
## ----------
#
## My config: everything local, except back-office (search + core + common + api + sql + pma)
#
## Full rebuild
## ------------
#
## when switching branches, I have to:
## - keep core and common mounted in m.euziere.yml
## - make clean
## - checkout the new branch
## - unmount core and common in m.euziere.yml
## - make max.full.begin
#
#max.full.begin: requirements docker.login npm npm.prune npm.install
#
## - re-mount core and common in m.euziere.yml
## - run 'make max.full.end'
#
#max.full.end: composer composer.install grunt.build.all front api phpmyadmin proxy
#
#
## Simple rebuild
## --------------
#
## When dependencies haven't changed, just call make max.simple
#
#max.simple: requirements docker.login grunt composer composer.install grunt.build.all front api phpmyadmin proxy
#
## After changing the source of search: make grunt.build
## After changing the source of core/common: make grunt.build.all
#
## ----------
##  s.savinel
## ----------
#
## See my docker-compose file in docker/compose/s.savinel.yml
#
#s.savinel.memcache.restart:
#	${docker-compose} restart memcached
#
## -----------------------------------------------------------------------------
## ALIAS
## -----------------------------------------------------------------------------
docker-compose = docker-compose --file ${COMPOSE_FILE} --project-name ${COMPOSE_PROJECT_NAME}
