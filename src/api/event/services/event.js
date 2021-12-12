'use strict';

/**
 * event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const getImageUrl = (strapi, picture) => {
    const baseUrl = strapi.config.server.url;
    const url = picture?.formats?.medium?.url || picture?.formats?.small?.url || picture?.formats?.thumbnail?.url;
    if (!url) {
        return null;
    }
    return baseUrl + url;
}

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
                imageUrl: getImageUrl(strapi, e.picture),
                totalMale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'MALE')?.length || 0,
                totalFemale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'FEMALE')?.length || 0,
            }));
    },
    async votes(args) {
        const today = new Date();
        const previous = new Date().setDate(today.getDate() - 3);
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
            populate: ['picture', 'event_users', 'event_users.users_permissions_user', 'event_users.picture', 'votes.users_permissions_user']
        });
        return results
            .filter(e => e.event_users.filter(e1 => !!e1.picture).length > 0)
            .map(e => ({
                ...e,
                imageUrl: getImageUrl(strapi, e.picture),
                voted: e.votes.some(e1 => e1.users_permissions_user.id === userId),
                pictures: e.event_users.filter(e1 => !!e1.picture).map(e1 => getImageUrl(strapi, e1.picture)),
                totalMale: e.event_users.filter(e1 => e1.users_permissions_user.gender === 'MALE')?.length,
                totalFemale: e.event_users.filter(e1 => e1.users_permissions_user.gender === 'FEMALE')?.length,
                totalVote: e.votes.length,
            }));
    },
    async galary(args) {
        const { results } = await strapi.service('api::event-user.event-user').find({
            filters: {
            },
            pagination: {
                pageSize: 1000,
                page: 0
            },
            populate: ['picture']
        });
        // return results;
        return results
            .filter(e => !!e.picture)
            .map(e => ({
                ...e,
                pictureUrl: getImageUrl(strapi, e.picture)
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
          $and:[{
              event_users: {
                users_permissions_user: {
                  id: userId
                }
              }
            },{
            $or:[
              {
                event_users: {
                  tookIn: true
                }
              },{
                end: {
                  $lt: currentDate
                }
              }
            ]
          }
          ],

        }
        const filtersNotDone = {
          $and:[{
            event_users: {
              users_permissions_user: {
                id: userId
              }
            }
          },{
              end: {
                $gt: currentDate
              }
            },
            {
              event_users: {
                tookIn: {
                  $ne:true
                }
              }
            }
          ],

        }
        const { results } = await strapi.service('api::event.event').find({
            filters: done ? filtersDone : filtersNotDone
            , populate: ['event_users', 'event_users.picture', 'event_users.users_permissions_user', 'votes', 'votes.picture', 'picture'],
            orderBy: { end: 'desc' }
        })
        return results.map(e => ({
            ...e, event_users: undefined, votes: undefined, picture: undefined,
            totalMale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'MALE')?.length || 0,
            totalFemale: e.event_users?.filter(e1 => e1.users_permissions_user.gender === 'FEMALE')?.length || 0,
            totalVote: e.votes?.length,
            imageUrl: getImageUrl(strapi, e.picture),
            joinerImageUrls: e.event_users?.filter(e1 => e1.picture != null).
                map(e1 => getImageUrl(strapi, e1.picture)),
        }));
    },
    async took(args) {
      const { id, userId } = args;
      const event = await strapi.service('api::event.event').findOne(id, {
        filters :{
          $and:[{
            event_users: {
              users_permissions_user: {
                id: userId
              }
            }
          }
          ]
        },
        populate: ['event_users', 'event_users.users_permissions_user', 'votes']
      })
      strapi.log.info(JSON.stringify(event))
      if(!event){
        throw new Error("Invalid event")
      }
      return await strapi.service('api::event-user.event-user').update(event.event_users[0].id,{
        data: {
          tookIn: true
        }
      })
    }
}));
