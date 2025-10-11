Why this file

This project is a PHP + HTML site intended to run under a PHP-enabled server (XAMPP, LAMP, shared hosting). Vercel is optimized for static sites and serverless functions and does not provide a persistent PHP runtime out of the box. If you want to host this project on Vercel you'll need to convert the PHP parts to serverless functions or deploy a Docker container (Enterprise). For most cases, use a PHP-capable host (shared hosting, DigitalOcean App Platform, Render with PHP support, or Railway using Docker).

Options to host Edukon

1) Recommended (fast): Use a PHP host
   - Zip the project and upload to a shared hosting (cPanel) account or deploy on a VPS with Apache + PHP.
   - On Windows, use XAMPP and upload the same folder to your webroot (htdocs).

2) Vercel (not recommended unless you convert):
   - You can host only static assets and serverless functions. You must convert PHP pages to Node/Serverless or use a Docker deployment with Vercel that provides PHP runtime (not available on free plan).
   - This requires non-trivial changes: replace includes with API endpoints, move session handling to a serverless store, and rewrite PHP render logic in Node.

3) Alternative modern hosts that support PHP easily:
   - Render (you can deploy a Docker file or use a static site with PHP via web service).
   - DigitalOcean App Platform (supports PHP deployments).
   - Hostinger / cPanel based shared hosting (upload zip and extract via file manager).

How to create a zip for upload (Windows PowerShell)

I included a helper script `zip_project.ps1` in the `deploy/` folder.
Usage (PowerShell):

  # from repository root (c:\xampp\htdocs\gitproject\)
  cd .\Edukon
  .\deploy\zip_project.ps1 -SourcePath . -OutZip ..\edukon-deploy.zip

This will create `edukon-deploy.zip` in the parent folder (one level up) ready to upload to a hosting file manager.

What to test after upload

- Ensure the `uploads/` folder retained images (logo/default.jpeg) and permissions allow webserver read.
- Start session support and test login/logout flows.
- Visit `syllabus.php` and verify the new UI and toggle behavior works.
- If things look broken, download logs (or open browser console) and paste errors here — I can help debug.

Notes about environment-specific features

- The project uses server-side sessions and writes to `$_SESSION['progress']` via an AJAX endpoint. This will only work on a server with PHP session support.
- If you choose to deploy to Vercel and need help converting the PHP to serverless Node endpoints, I can propose a migration plan.

Contact

If you want, tell me which host you'll use and I will produce a tailored deploy checklist for that platform (eg. cPanel, DigitalOcean, Render).