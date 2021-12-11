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
      method: 'POST',
      path: '/events/:id/join',
      handler: 'api::event.event.join',
    },
    {
      method: 'GET',
      path: '/events/mine',
      handler: 'api::event.event.mine',
    }
  ]
}
