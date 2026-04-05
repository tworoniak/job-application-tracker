const config = {
    schema: process.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql',
    documents: ['src/**/*.graphql'],
    generates: {
        './src/lib/graphql/__generated__/': {
            preset: 'client',
            config: {
                strictScalars: true,
                scalars: {
                    DateTime: 'string',
                    ID: 'string',
                },
                useTypeImports: true,
            },
        },
    },
    ignoreNoDocuments: true,
};
export default config;
