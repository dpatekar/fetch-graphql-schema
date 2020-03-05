const fetch = require('node-fetch');

const {
  buildClientSchema,
  introspectionQuery,
  printSchema,
} = require('graphql/utilities');


module.exports = function fetchGraphQLSchema(url, options) {
  options = options || {}; // eslint-disable-line no-param-reassign
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: options.token,
    },
    body: JSON.stringify({
      query: introspectionQuery,
    }),
  })
  .then(res => res.json())
  .then(schemaJSON => {
    if (options.readable) {
      return printSchema(buildClientSchema(schemaJSON.data));
    }
    return JSON.stringify(schemaJSON, null, 2);
  });
};
