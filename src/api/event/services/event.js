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
        const { userId } = args;
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                end: {
                    $gt: new Date()
                },
                event_users: {
                    users_permissions_user: {
                        id: {
                            $ne: userId
                        }
                    }
                }
            }, populate: ['event_users', 'votes']
        });
        return results;
    },
    async join(args) {
        const { id, userId } = args;
        const event = await strapi.service('api::event.event').findOne(id, {
            populate: ['event_users', 'event_users.users_permissions_user']
        });
        if (!event?.event_users.some(e => e.users_permissions_user.id === userId)) {
            return await strapi.service('api::event-user.event-user').create({
                data: {
                    event: id,
                    users_permissions_user: userId
                }
            });
        }
        return event;
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

