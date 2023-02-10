
const isProd = () => (process.env.NODE_ENV === "prod" ? true : false);

export {

  isProd,
};
