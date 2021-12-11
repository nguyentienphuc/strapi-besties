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
            filters: done?filtersDone:filtersNotDone
          , populate: ['event_users', 'votes','picture'],
            orderBy:{ end: 'desc' }
        });
        return results;
    }
}));

