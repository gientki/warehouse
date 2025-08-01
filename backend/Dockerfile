FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libicu-dev libonig-dev \
    && docker-php-ext-install pdo pdo_mysql intl

RUN a2enmod rewrite
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . ./
RUN composer install --no-interaction

# Prawa
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

COPY apache.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite