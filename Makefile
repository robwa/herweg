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
	$(CP) -r frontend/build ./herweg
	$(MKDIR_P) ./herweg/api/v1
	$(CP) backend/src/api/v1/*.php ./herweg/api/v1/

.PHONY: with-db
with-db: collect
	sqlite3 ./herweg/api/db.sqlite3 < backend/db/schema.sql
	chmod -R ugo+rwX ./herweg

.PHONY: pkg
pkg: with-db
	tar cvf herweg.tar ./herweg
