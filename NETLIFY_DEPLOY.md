# Deploy στο Netlify — The Pouma Academy

## 1. Σύνδεση με GitHub

1. Ανέβασε το repo στο [github.com/sio2000/pouma](https://github.com/sio2000/pouma).
2. Στο [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Επίλεξε το repo `sio2000/pouma`.
4. Netlify θα διαβάσει αυτόματα το `netlify.toml` (build: `npm run build`, plugin Next.js).

## 2. Μεταβλητές περιβάλλοντος (υποχρεωτικές)

Στο Netlify: **Site configuration → Environment variables**

| Variable | Περιγραφή |
|----------|-----------|
| `ADMIN_PASSWORD` | Κωδικός σύνδεσης admin panel |
| `ADMIN_SESSION_SECRET` | Τυχαίο μυστικό (π.χ. 32+ χαρακτήρες) |
| `NEXT_PUBLIC_SITE_URL` | Το τελικό domain, π.χ. `https://thepoumaacademy.com` (χωρίς `/` στο τέλος) |

Μετά την αλλαγή env vars, κάνε **Trigger deploy** για να εφαρμοστούν.

## 3. Admin panel

- URL: `https://το-domain-σου.com/admin`
- Email: `ask@thepoumaacademy.com` (όπως στο `siteConfig`)
- Password: η τιμή του `ADMIN_PASSWORD`

## 4. Αποθήκευση δεδομένων στο Netlify

Στο production χρησιμοποιούνται **Netlify Blobs** (όχι τοπικά αρχεία):

- `pouma-data` — αιτήματα επικοινωνίας & υλικό τάξης (JSON)
- `pouma-uploads` — ανεβασμένα PDF/εικόνες

Τοπικά (`npm run dev`) συνεχίζει να γράφει στον φάκελο `data/` και `public/uploads/`.

## 5. Custom domain

1. Netlify → **Domain management** → πρόσθεσε το domain.
2. Όρισε DNS όπως δείχνει το Netlify.
3. Ενημέρωσε `NEXT_PUBLIC_SITE_URL` με το τελικό URL.
4. Κάνε redeploy.

## 6. Τοπική δοκιμή με Netlify

```bash
npm install -g netlify-cli
netlify link
netlify dev
```
