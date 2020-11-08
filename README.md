# Herweg

## useful commands
```
sudo apt install apache2 php php-sqlite3 libapache2-mod-php
#sudo apt install sqlitebrowser
sudo a2enmod rewrite
sudo ln -s $(pwd)/backend/var/www/herweg /var/www/
sudo ln -s $(pwd)/backend/etc/apache2/sites-available/herweg.conf /etc/apache2/sites-available/
sudo ln -s /etc/apache2/sites-available/herweg.conf /etc/apache2/sites-enabled/
sudo systemctl restart apache2
sqlite3 backend/var/www/herweg/db.sqlite3 < backend/var/www/herweg/schema.sql

#FIXME: THIS IS INSECURE
chmod -R ugo+rwX backend/var/www/herweg
```
