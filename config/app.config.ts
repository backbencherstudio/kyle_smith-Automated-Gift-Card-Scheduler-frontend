// server base url
export const URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://192.168.4.4:4000";
// app config
export const AppConfig = () => ({
  app: {
    // server endpoint
    url: URL,
    name: "Timely Gifts",
    slogan: "Timely Gifts",
    meta: {
      description: "Timely Gifts",
      keywords: "Timely Gifts",
    },

    // api endpoint
    apiUrl: `${URL}/api`,
  },
});
