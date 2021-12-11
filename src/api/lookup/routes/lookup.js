'use strict';

/**
 * lookup router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::lookup.lookup');
