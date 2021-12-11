'use strict';

/**
 * team router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/:id/teams',
      handler: 'api::event.event.teams',
    },
    {
      method: 'GET',
      path: '/events/mine',
      handler: 'api::event.event.mine',
    }
  ]
}
