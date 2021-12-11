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
        const baseUrl = strapi.config.server.url;
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                end: {
                    $gt: new Date()
                }
            },
            pagination: {
                pageSize: 100,
                page: 0
            },
            populate: ['picture', 'event_users', 'event_users.users_permissions_user', 'event_users.picture', 'votes']
        });
        return results
            .filter(e => !e.event_users.some(e1 => e1.users_permissions_user.id === userId))
            .filter(e => e.event_users.length < e.max)
            .map(e => ({
                ...e,
                imageUrl: baseUrl + e.picture?.formats?.medium?.url,
                totalMale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'MALE')?.length || 0,
                totalFemale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'FEMALE')?.length || 0,
            }));
    },
    async votes(args) {
        const today = new Date();
        const previous = new Date().setDate(today.getDate() - 3);
        const baseUrl = strapi.config.server.url;
        const { userId } = args;
        const { results } = await strapi.service('api::event.event').find({
            filters: {
                end: {
                    $lt: today,
                    $gt: previous,
                }
            },
            pagination: {
                pageSize: 100,
                page: 0
            },
            populate: ['picture', 'event_users', 'event_users.users_permissions_user', 'event_users.picture', 'votes']
        });
        console.log(results);
        return results
            .filter(e => e.event_users.filter(e1 => !!e1.picture).length > 0)
            .map(e => ({
                ...e,
                imageUrl: baseUrl + e.picture?.formats?.medium?.url,
                voted: e.votes.some(e1 => e1.users_permissions_user.id === userId),
                pictures: e.event_users.filter(e1 => !!e1.picture).map(e1 => baseUrl + e1?.picture?.formats?.thumbnail?.url),
                totalMale: e.event_users.filter(e1 => e1.users_permissions_user.gender === 'MALE')?.length,
                totalFemale: e.event_users.filter(e1 => e1.users_permissions_user.gender === 'FEMALE')?.length,
                totalVote: e.votes.length,
            }));
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
    async vote(args) {
        const { id, userId } = args;
        const event = await strapi.service('api::event.event').findOne(id, {
            populate: ['event_users', 'event_users.users_permissions_user', 'votes']
        });
        if (!event?.votes.some(e => e.users_permissions_user.id === userId)) {
            return await strapi.service('api::vote.vote').create({
                data: {
                    event: id,
                    users_permissions_user: userId
                }
            });
        }
        return event;
    },
    async mine(args) {
        const { userId, done } = args
        const currentDate = new Date()
        const filtersDone = {
            $and: [{
                event_users: {
                    users_permissions_user: {
                        id: userId
                    }
                }
            },
            {
                end: {
                    $gt: currentDate
                }
            }]

        }
        const filtersNotDone = {
            $and: [{
                event_users: {
                    users_permissions_user: {
                        id: userId
                    }
                }
            },
            {
                end: {
                    $lt: currentDate
                }
            }]

        }
        const { results } = await strapi.service('api::event.event').find({
            filters: done ? filtersDone : filtersNotDone
            , populate: ['event_users', 'event_users.picture', 'event_users.users_permissions_user', 'votes', 'votes.picture', 'picture'],
            orderBy: { end: 'desc' }
        })
        const baseUrl = strapi.config.server.url
        return results.map(e => ({
            ...e,
            totalMale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'MALE')?.length || 0,
            totalFemale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'FEMALE')?.length || 0,
            totalVote: e.votes?.length,
            imageUrl: strapi.config.server.url + e.picture?.formats?.medium?.url,
            joinerImageUrls: e.event_users?.filter(e1 => e1.picture != null).
                map(e1 => baseUrl + e1?.picture?.formats?.thumbnail?.url)
        }));
    }
}));

