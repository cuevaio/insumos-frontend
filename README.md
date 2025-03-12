# Insumos UI for GSMS and External Scopes

This is a frontend React application designed to operate within the **GSMS** scope and external environments.

## Configuration

Use the `.env.example` file to as example to configure environment variables for the app.

### Environment Variables
- **`VITE_GSMS_PATH`**: The path where the app will be served within the GSMS scope.
- **`VITE_API_DOMAIN`**: The URL where the app will consume data.
- **`VITE_EXTERNAL_API_DOMAIN`**: The URL for data consumption if the app is running externally as a proxy.
- **`VITE_SERVER_SCOPE`**: Defines the scope where the app is running. Possible values are `gsms` or `kube`.

## Scripts

- **Install dependencies**:
  ```bash
  pnpm install
  ```

- **Run tests**:
  ```bash
  pnpm test
  ```

- **Run in development mode**:
  ```bash
  pnpm dev
  ```

- **Build the app**:
  ```bash
  pnpm build
  ```

## Deployment to GSMS Scope

1. Ensure the `.env` file has:
   ```env
   VITE_SERVER_SCOPE=gsms
   ```
2. Build the app:
   ```bash
   pnpm build
   ```
3. Copy the build assets to the path specified in `VITE_GSMS_PATH` in your GSMS domain.

---

For additional information or support, please reach out to the ITL frontend team.

