'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
    async join(ctx) {
        try {
            const { id } = ctx.params;
            const { user } = ctx.state;
            return await strapi.service('api::event.event').join({
                id: id,
                userId: user.id
            });
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async vote(ctx) {
        try {
            const { id } = ctx.params;
            const { user } = ctx.state;
            return await strapi.service('api::event.event').vote({
                id: id,
                userId: user.id
            });
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
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
            const { body } = ctx.request;
            return {
                data: await strapi.service('api::event.event').create({ data: body })
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async all(ctx) {
        try {
            const { user } = ctx.state;
            return {
                data: await strapi.service('api::event.event').all({ userId: user.id })
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
