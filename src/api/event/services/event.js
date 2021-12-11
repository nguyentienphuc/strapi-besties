'use strict';

/**
 * event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event.event', ({ strapi }) => ({
    async findOne(entityId, params) {
        const result = await super.findOne(entityId, {
            populate: ['event_users', 'votes']
        });
        return result;
    },
    async all(args) {
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                end: {
                    $gt: new Date()
                }
            }, populate: ['event_users', 'votes']
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

            }, populate: ['event_users', 'votes']
        });
        return results;
    }
}));

