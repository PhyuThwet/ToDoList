# Node.js, PHP and MySQL Dev Container

## Start

1. Install Docker Desktop and the VS Code **Dev Containers** extension.
2. Open this folder in VS Code.
3. Run **Dev Containers: Reopen in Container** from the Command Palette.

The app container includes PHP 8.3 and Node.js 22. MySQL 8.4 starts alongside it and stores data in a named Docker volume.

## Database connection

From code running inside the Dev Container, use:

| Setting  | Default |
| -------- | ------- |
| Host     | `mysql` |
| Port     | `3306`  |
| Database | `app`   |
| User     | `app`   |
| Password | `app`   |

From Windows, connect to `127.0.0.1:3306`. You can override `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, and `MYSQL_PORT` before starting the container.

Environment file

 - Copy `.env.example` to `.env` in the project root to override database settings for the PHP backend. The example file contains the same defaults used by the Dev Container:

	 - Host: `mysql` (container network) or `127.0.0.1` (host)
	 - Port: `3306`
	 - Database: `app`
	 - User: `app`
	 - Password: `app`

See [.env.example](.env.example) for the template.

Check the installed runtimes from the Dev Container terminal:

```sh
node --version
npm --version
php --version
```

## React frontend

The React 19 and TypeScript app is in `frontend/` and uses Vite. Dependencies are
installed when the project is first set up. To start the development server:

```sh
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. Vite listens on all container interfaces so the
existing `5173:5173` port mapping exposes it to the host.

Run the frontend checks with:

```sh
cd frontend
npm run lint
npm run build
```

## PHP backend

To run the current PHP entry point in a second terminal:

```sh
php -S 0.0.0.0:8000 -t backend
```

Open <http://localhost:8000>.


database table create
cd backend/database
php database.php
