module.exports = {
    client: {
        service: {
            name: 'alloff-backoffice',
            localSchemaFile: './graphql-schema.json',
        },
        includes: ['./graphql/**/*.ts'],
    },
};