'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
    async all(ctx) {
        try {
            return {
                data: await strapi.service('api::event.event').all()
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async teams(ctx) {
        try {
            const { id } = ctx.params;
            console.log(ctx.params);
            return {
                data: await strapi.service('api::event.event').teams({ id })
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async mine(ctx) {
        try {
            const { user } = ctx.state;
            return {
                data: await strapi.service('api::event.event').mine({ userId: user.id })
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    }
}));
