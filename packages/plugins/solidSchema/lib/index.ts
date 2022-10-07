import { Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema, printSchema, parse } from 'graphql';

// Adds the compiled schema to the source document
export function plugin<T = any>(schema: GraphQLSchema, documents: Types.DocumentFile[], config: T): Types.Promisable<Types.PluginOutput> {
  
  return {
    content: '',
    prepend: [
      `import applySolidDirectives from '@inrupt/graphql-directives-solid'`
    ],
    append: [`
/** The built schema */
export const schema = applySolidDirectives(baseSchema);
`
    ]
  }
}

export const addToSchema = /* GraphQL */ `
# Custom Scalars
scalar Date
scalar URL

directive @property(iri: String!) on FIELD_DEFINITION # Require a singular property
directive @is(class: String!) on OBJECT
directive @identifier on ARGUMENT_DEFINITION | FIELD_DEFINITION
directive @webId on FIELD_DEFINITION
`
