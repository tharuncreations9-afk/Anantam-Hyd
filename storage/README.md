# Enquiry storage

- **Local / VPS:** `storage/enquiries.json` (created automatically when `BLOB_READ_WRITE_TOKEN` is unset).
- **Vercel:** each enquiry is a private Blob at `enquiries/<id>.json`.

## Enable on Vercel

1. Open the project on [vercel.com](https://vercel.com)
2. **Storage** → **Create** → **Blob**
3. Connect the store to this project (all environments)
4. Redeploy — `BLOB_READ_WRITE_TOKEN` is injected automatically
