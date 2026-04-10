const appJson = require("./app.json");

module.exports = ({ config }) => {
  const base = config ?? appJson.expo ?? appJson;

  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return {
    ...base,
    android: {
      ...(base.android ?? {}),
      config: {
        ...((base.android ?? {}).config ?? {}),
        googleMaps: {
          ...((((base.android ?? {}).config ?? {}).googleMaps ?? {})),
          ...(googleMapsApiKey ? { apiKey: googleMapsApiKey } : {}),
        },
      },
    },
  };
};

