FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Copy application files
# We copy index.php and FileHandler.php. flag.txt is handled separately.
COPY index.php FileHandler.php ./

# Move the flag to the root directory to prevent direct web access.
# This forces the user to exploit the LFI/Object Injection.
COPY flag.txt /flag.txt

# Ensure the flag is readable by the web server user
RUN chmod 644 /flag.txt

# Set permissions for web directory
RUN chown -R www-data:www-data /var/www/html/

# Expose port 80
EXPOSE 80
