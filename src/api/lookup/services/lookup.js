'use strict';

/**
 * lookup service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lookup.lookup');
