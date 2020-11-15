NVM_DIR ?= $(HOME)/.nvm
CP ?= cp
MKDIR_P ?= mkdir -p

.PHONY: all
all: pkg

.PHONY: ui
ui:
	cd frontend && \. "$(NVM_DIR)/nvm.sh" && nvm use && npm run-script build

.PHONY: collect
collect: ui
	$(RM) herweg.tar
	$(RM) -r herweg
	$(MKDIR_P) herweg
	sqlite3 herweg/db.sqlite3 < backend/db/schema.sql
	$(CP) -r frontend/build ./herweg/herweg
	$(CP) backend/src/*.php ./herweg/
	$(CP) backend/src/.htaccess ./herweg/
	chmod -R ugo+rwX ./herweg

.PHONY: pkg
pkg: collect
	tar cvf herweg.tar ./herweg
