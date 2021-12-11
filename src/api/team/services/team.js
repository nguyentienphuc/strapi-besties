'use strict';

/**
 * team service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::team.team', ({ strapi }) => ({
    async join(args) {
        const { eventId, teamId, userId } = args;
        const { results } = await strapi.service('api::team-user.team-user').find({
            filters: {
                event: eventId,
                users_permissions_user: userId
            }
        });
        console.log(results);
        // return teamUser;
        if (results.length) {
            throw new Error('Bạn đã tham gia event này');
        }
        return await strapi.service('api::team-user.team-user').create({
            data: {
                event: eventId,
                team: teamId,
                users_permissions_user: userId
            }
        });
    },
    async vote(args) {
        const { eventId, teamId, userId } = args;
        const { results } = await strapi.service('api::vote.vote').find({
            filters: {
                event: eventId,
                team: teamId,
                users_permissions_user: userId
            }
        });
        if (results.length) {
            return await strapi.service('api::vote.vote').delete(results[0].id);
        }
        return await strapi.service('api::vote.vote').create({
            data: {
                event: eventId,
                team: teamId,
                users_permissions_user: userId
            }
        });
    }
}));
