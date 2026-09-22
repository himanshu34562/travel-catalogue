const { Storage } = require('@google-cloud/storage');
const { Logging } = require('@google-cloud/logging');

// On a GCE VM, both clients automatically pick up credentials from the
// instance's attached service account — no key file needed, as long as
// that service account has the Storage Object Admin and Logs Writer roles.

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = bucketName ? storage.bucket(bucketName) : null;

const logging = new Logging();
const cloudLog = logging.log('travel-app-log');

/**
 * Write a structured entry to Cloud Logging. Never throws — logging
 * failures shouldn't take down a request.
 */
async function logEvent(severity, message, metadata = {}) {
  try {
    const entry = cloudLog.entry({ severity, resource: { type: 'global' } }, { message, ...metadata });
    await cloudLog.write(entry);
  } catch (err) {
    console.error('Cloud Logging write failed (non-fatal):', err.message);
  }
}

module.exports = { bucket, logEvent };
