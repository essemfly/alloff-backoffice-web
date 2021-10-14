#!/bin/bash
HOST="${ALLOFF_GRAPHQL_HOST:-http://127.0.0.1:8088}"
# HOST="${ALLOFF_GRAPHQL_HOST:-https://outlet.lett.io}"
echo GRAPHQL CODEGEN FROM HOST $HOST
npx apollo service:download --endpoint=${HOST}/query graphql-schema.json
# https://github.com/apollographql/apollo-tooling/issues/2030
npx apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --tagName=gql --globalTypesFile __generated-globals__/globalTypes.d.ts