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
      path: '/events/mine',
      handler: 'api::event.event.mine',
    }
  ]
}
