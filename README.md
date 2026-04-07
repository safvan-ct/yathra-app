# REACT PROJECT SETUP GUIDE

1. Clone the Repository

---

git clone https://github.com/safvan-ct/yathra-app.git

2. Upload dist files from loacl to host (public_html or sub folder)

---

Every changes npm run build on local and upload to host

3. Add .htaccess File

---

Place in public_html > .htaccess: OR
Place in public_html > sub folder > .htaccess:

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    RewriteCond %{REQUEST_URI} !^/assets/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    RewriteRule . /index.html [L]

</IfModule>
