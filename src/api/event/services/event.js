'use strict';

/**
 * event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event.event', ({ strapi }) => ({
    async teams(args) {
        const { id } = args;
        const { results } = await strapi.service('api::team.team').find({
            filters: {
                event: id
            },
            populate: {
                team_users: true
            }
        });
        return results;
    },
    async mine(args) {
        const { userId } = args;
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                event_users: {
                    id: userId
                }
            },
            populate: {
                teams: true,
                event_users: true
            }
        });
        return results;
    }
}));

