# Sitio web de Yomi Ortega

Sitio estático generado con **Eleventy** + panel de edición **Decap CMS**, pensado para
que Yomi publique blogs, fotos y videos de YouTube **sin tocar código**.

---

## Cómo funciona (resumen mental)

- **Porkbun** = dueño del dominio `yomiortega.com` (no se toca, solo se ajusta el DNS una vez).
- **GitHub** = donde vive el código.
- **Netlify** = el hosting. Agarra el código de GitHub, lo construye y lo publica.
  Además da el login del `/admin`.
- **Eleventy** = el "motor" que convierte los `.md` que escribe Yomi en páginas web.
  Corre solo dentro de Netlify. Nadie lo ejecuta a mano en producción.

Cada vez que Yomi pulsa **"Publicar"** en `/admin`, se guarda un archivo en GitHub,
Netlify lo detecta, reconstruye el sitio y en ~1 minuto está en vivo.

---

## Estructura de carpetas

```
├── src/                      ← TODO lo editable vive aquí
│   ├── index.njk                 Home (tu diseño original)
│   ├── _includes/                plantillas compartidas (base, artículo, mapa SVG)
│   ├── _data/site.json           datos globales (redes, email…)
│   ├── css/styles.css            estilos
│   ├── assets/img/               fotos fijas (retrato de Yomi, etc.)
│   ├── assets/uploads/           ← aquí caen las fotos que Yomi sube desde /admin
│   ├── blog/index.njk            página que lista los artículos
│   ├── content/blog/*.md         ← cada artículo del blog (Yomi los crea)
│   └── admin/                    el panel de Yomi (Decap CMS)
├── .eleventy.js              configuración del motor
├── netlify.toml              configuración de Netlify
├── package.json
└── _original-backup.html     tu index.html original, por si acaso
```

---

## Trabajar en local (para ti, Juan)

```bash
npm install       # solo la primera vez
npm start         # abre el sitio en http://localhost:8099 con recarga automática
npm run build     # genera el sitio final en la carpeta _site/
```

---

## Publicar por primera vez (una sola vez)

1. **Subir a GitHub.** Crea un repo (ej. `yomiortega-web`) y sube esta carpeta.
   ```bash
   git init && git add . && git commit -m "Sitio inicial"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/yomiortega-web.git
   git push -u origin main
   ```

2. **Conectar a Netlify.** En [netlify.com](https://netlify.com) → *Add new site* →
   *Import from Git* → elige el repo. Netlify lee `netlify.toml` solo (build = `npm run build`,
   publish = `_site`). Da *Deploy*. En ~1 min tienes una URL tipo `xxx.netlify.app`.

3. **Apuntar el dominio (Porkbun).** En Netlify → *Domain settings* → añade `yomiortega.com`.
   Netlify te dirá qué registros DNS poner. En **Porkbun** → tu dominio → *DNS* → añade esos
   registros (normalmente un `A` a la IP de Netlify y un `CNAME` para `www`). El HTTPS lo pone
   Netlify solo.

4. **Activar el login de Yomi (`/admin`).** En Netlify:
   - *Site configuration → Identity* → **Enable Identity**.
   - En *Identity → Services → Git Gateway* → **Enable Git Gateway**.
   - *Identity → Invite users* → invita el correo de Yomi. Le llega un email para poner su contraseña.
   - Recomendado: en *Identity → Registration* ponlo en **Invite only** (así nadie más se registra).

   > ⚠️ **Si tu cuenta de Netlify no ofrece "Identity"** (lo están retirando en cuentas nuevas):
   > alternativa = cambiar en `src/admin/config.yml` el backend a GitHub:
   > ```yml
   > backend:
   >   name: github
   >   repo: TU-USUARIO/yomiortega-web
   >   branch: main
   > ```
   > En ese caso Yomi entra al `/admin` con una **cuenta de GitHub** (gratis) a la que le des
   > acceso al repo como *collaborator*. Un paso extra al inicio, pero luego edita igual de fácil.

5. **Darle a Yomi el archivo `GUIA-YOMI.md`** (o pásaselo como PDF/impreso).

Listo. A partir de ahí Yomi publica sola y tú no intervienes.
