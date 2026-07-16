const onepayConfig = {
  appId: process.env.ONEPAY_APP_ID,
  appToken: process.env.ONEPAY_APP_TOKEN,
  hashSalt: process.env.ONEPAY_HASH_SALT,
  callbackToken: process.env.ONEPAY_CALLBACK_TOKEN,
  baseUrl: "https://api.onepay.lk/v3",
};

export default onepayConfig;
