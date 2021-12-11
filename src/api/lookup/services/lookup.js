'use strict';

/**
 * lookup service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lookup.lookup', ({ strapi }) => ({
    async all(args) {
        const { results } = await super.find({
            pagination: {
                pageSize: 100,
                page: 0
            }
        });
        return results;
    },
}));

