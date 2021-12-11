'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            return {
                data: await strapi.service('api::event.event').findOne(id)
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async create(ctx) {
        try {
            console.log(ctx.body);
            return {
                data: await super.create(ctx)
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async all(ctx) {
        try {
            return {
                data: await strapi.service('api::event.event').all()
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
