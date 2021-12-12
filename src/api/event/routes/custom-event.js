'use strict';

/**
 * team router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/all',
      handler: 'api::event.event.all',
    },
    {
      method: 'GET',
      path: '/events/votes',
      handler: 'api::event.event.votes',
    },
    {
      method: 'POST',
      path: '/events/:id/join',
      handler: 'api::event.event.join',
    },
    {
      method: 'POST',
      path: '/events/:id/vote',
      handler: 'api::event.event.vote',
    },
    {
      method: 'POST',
      path: '/events/:id/took',
      handler: 'api::event.event.took',
    },
    {
      method: 'POST',
      path: '/events/:id/join',
      handler: 'api::event.event.join',
    }
  ]
}
