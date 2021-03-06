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
          strapi.log.error(err)
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
          strapi.log.error(err)
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
          strapi.log.error(err)
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
          strapi.log.error(err)
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
            strapi.log.error(err)
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async votes(ctx) {
        try {
            const { user } = ctx.state;
            return {
                data: await strapi.service('api::event.event').votes({ userId: user.id })
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async galary(ctx) {
        try {
            return {
                data: await strapi.service('api::event.event').galary()
            };
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async mine(ctx) {
        try {
            const { user } = ctx.state
            const done =  'true'===ctx.query.done
            return {
                data: await strapi.service('api::event.event').mine(
                    {
                        userId: user.id,
                        done: done
                    })
            };
        } catch (err) {
            strapi.log.error(err)
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
    async took(ctx) {
      try {
        const { id } = ctx.params;
        const { user } = ctx.state;
        return await strapi.service('api::event.event').took({
          id: id,
          userId: user.id
        });
      } catch (err) {
        strapi.log.error(err)
        return ctx.badRequest('Có lỗi xảy ra', err);
      }
    }
}));
