require("dotenv").config();

function validateConfig(config) {
  if (!config.port) {
    throw new Error("\x1b[31mPort is not defined in config.js\x1b[0m");
  }
  if (!config.environment) {
    throw new Error("\x1b[31mEnvironment is not defined in config.js\x1b[0m");
  }
  if (config.secret === undefined) {
    throw new Error("\x1b[31mSecret is not defined in config.js\x1b[0m");
  }
  if (config.token_expiration === undefined) {
    throw new Error(
      "\x1b[31mJWT expiration is not defined in config.js\x1b[0m"
    );
  }
  if (config.cookie_http_only === undefined) {
    throw new Error(
      "\x1b[31mCookie http only is not defined in config.js\x1b[0m"
    );
  }
  if (config.email_service === undefined) {
    throw new Error("\x1b[31mEmail service is not defined in config.js\x1b[0m");
  }

  if (!config.email_username) {
    throw new Error(
      "\x1b[31mEmail username is not defined in config.js\x1b[0m"
    );
  }
  if (!config.email_password) {
    throw new Error(
      "\x1b[31mEmail password is not defined in config.js\x1b[0m"
    );
  }
  console.log("\x1b[32m[nous] config validated successfully!\x1b[0m");
}

module.exports = {
  port: process.env.PORT || 3001,
  environment: process.env.ENVIRONMENT,
  db_uri: process.env.MONGODB_URI,
  validateConfig,
  secret: process.env.JWT_SECRET,
  token_expiration: process.env.JWT_EXPIRES_IN, 
  cookie_http_only: true,
  email_service: process.env.EMAIL_SERVICE,
  email_username: process.env.EMAIL_USERNAME,
  email_password: process.env.EMAIL_PASSWORD,
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  mediaSize:  process.env.MEDIA_SIZE || 20 * 1024 * 1024,
};
