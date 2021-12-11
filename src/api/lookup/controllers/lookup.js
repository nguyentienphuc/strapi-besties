'use strict';

/**
 *  lookup controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lookup.lookup', ({ strapi }) => ({
    async all(ctx) {
        try {
            return {
                data: await strapi.service('api::lookup.lookup').all()
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    }
}));

