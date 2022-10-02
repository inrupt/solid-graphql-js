import { MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { DataFactory } from 'n3';
import { queryObject } from '../sparql';
import { FieldConfig } from "../types";
import { getResolverFromConfig, getSingleDirective } from './util';

function nodeFromDirective(directive: Record<string, any> | undefined, directiveName: string) {
  if (!directive) {
    throw new Error(`@${directiveName} requires exactly one argument, received 0`);
  }

  const entries = Object.entries(directive);

  if (entries.length !== 1) {
    throw new Error(`@${directiveName} requires exactly one argument, received ${entries.length}`);
  }

  const [[key, value]] = entries;

  if (typeof value !== 'string') {
    throw new Error(`@${directiveName} accepts only string values, received ${typeof value}`);
  }

  const mapping = {
    iri: DataFactory.namedNode
  }

  if (key in mapping) {
    return mapping[key as 'iri'](value);
  }

  throw new Error(`Expected key to be one of ${Object.keys(mapping).join(', ')}; received ${key}`);
}

export function propertiesDirective(directiveName: string): (schema: GraphQLSchema) => GraphQLSchema {
  return schema =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig: FieldConfig) => {
        const directive = getSingleDirective(schema, fieldConfig, directiveName);

        if (directive) {
          // Get this field's original resolver
          const resolve = getResolverFromConfig(fieldConfig);

          // Replace the original resolver with a function that *first* replaces the node with the identifier
          // and then performs the standard resolution actions
          fieldConfig.resolve = async function (source, args, context, info) {
            throw new Error('Properties not implemented');

            return resolve(
              {
                [info.fieldName]: {
                  __node: await queryObject(context, source.__node, nodeFromDirective(directive, directiveName))
                }
              },
              args, context, info
            );
          }
        }

        return fieldConfig;
      }
    })
}