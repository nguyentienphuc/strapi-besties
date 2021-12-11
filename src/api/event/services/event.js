'use strict';

/**
 * event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event.event', ({ strapi }) => ({
    async all(args) {
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                end: {
                    $gt: new Date()
                }
            }, populate: ['teams', 'team_users', 'event_users']
        });
        return results;
    },
    async teams(args) {
        const { id } = args;
        const { results } = await strapi.service('api::team.team').find({
            filters: {
                event: {
                    id: id
                }
            }, populate: ['event', 'team_users', 'votes']
        });
        return results;
    },
    async mine(args) {
        const { userId } = args;
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                $and: [{
                    $or: [{
                        team_users: {
                            users_permissions_user: {
                                id: userId
                            }
                        }
                    },
                    {
                        event_users: {
                            users_permissions_user: {
                                id: userId
                            }
                        }
                    }]
                }, {
                    end: {
                        $gt: new Date()
                    }
                }]

            }, populate: ['teams', 'team_users', 'event_users']
        });
        return results;
    }
}));

