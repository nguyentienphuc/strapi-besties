'use strict';

/**
 *  team controller
 */
// const { sanitizedEntity } = require('@strapi/strapi-ultis');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::team.team', ({ strapi }) => ({
    async join(ctx) {
        try {
            const { id } = ctx.params;
            const { user } = ctx.state;

            const team = await strapi.service('api::team.team').findOne(id, {
                populate: {
                    event: true
                }
            });
            return await strapi.service('api::team.team').join({
                eventId: team.event?.id,
                teamId: team.id,
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

            const team = await strapi.service('api::team.team').findOne(id, {
                populate: {
                    event: true
                }
            });
            return await strapi.service('api::team.team').join({
                eventId: team.event?.id,
                teamId: team.id,
                userId: user.id
            });
        } catch (err) {
            return ctx.badRequest('Có lỗi xảy ra', err);
        }
    },
}));
