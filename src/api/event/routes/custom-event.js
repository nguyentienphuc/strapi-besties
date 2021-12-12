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
      method: 'GET',
      path: '/events/galary',
      handler: 'api::event.event.galary',
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
      method: 'GET',
      path: '/events/mine',
      handler: 'api::event.event.mine',
    }
  ]
}
