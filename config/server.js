module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3000),
  url: env('WEBSITE', 'https://besties.tonysmash.com/'), // THIS ONE
});
