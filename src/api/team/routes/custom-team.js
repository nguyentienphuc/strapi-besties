'use strict';

/**
 * team router.
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/teams/join/:id',
      handler: 'api::team.team.join',
    },
    {
      method: 'GET',
      path: '/teams/vote/:id',
      handler: 'api::team.team.vote',
    }
  ]
}
