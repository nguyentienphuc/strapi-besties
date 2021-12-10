module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'c8c34be540bdcb294f1940905469a6b5'),
  },
});
