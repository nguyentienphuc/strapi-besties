'use strict';

/**
 * team router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/lookups/all',
      handler: 'api::lookup.lookup.all',
    }
  ]
}
