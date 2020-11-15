NVM_DIR ?= $(HOME)/.nvm
CP ?= cp

.PHONY: all
all: pkg

.PHONY: ui
ui:
	cd frontend && \. "$(NVM_DIR)/nvm.sh" && nvm use && npm run-script build

.PHONY: db
db: ui
	sqlite3 frontend/build/db.sqlite3 < backend/db/schema.sql

.PHONY: collect
collect: db
	$(RM) herweg.tar
	$(RM) -r herweg
	$(CP) -r frontend/build ./herweg
	$(CP) backend/src/*.php ./herweg/
	$(CP) backend/src/.htaccess ./herweg/
	chmod -R ugo+rwX ./herweg

.PHONY: pkg
pkg: collect
	tar cvf herweg.tar ./herweg
