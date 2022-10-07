import { MapperKind, mapSchema, ScalarTypeMapper } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { Term } from '@rdfjs/types';
import { DataFactory as DF, Literal } from 'n3';
import { TypeHandlerDate, TypeHandlerNumberDouble, TypeHandlerNumberInteger, TypeHandlerString } from 'rdf-literal';


interface Mapper<T> {
  serialize(value: Term): T;
  parseValue(value: T): Term;
}

function scalarMapperFactory<T>(mapper: Mapper<T>) {
  return (scalarName: string) => (schema: GraphQLSchema) => mapSchema(schema, {
    [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
      if (fieldConfig.name === scalarName) {
        // @ts-ignore
        fieldConfig.serialize = mapper.serialize;
        // @ts-ignore
        fieldConfig.parseValue = mapper.parseValue;
      }
      return fieldConfig;
    }
  });
}

function stringHandler<T>(mapper: Mapper<T>) {
  return (scalarName: string) => (schema: GraphQLSchema) => mapSchema(schema, {
    [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
      if (fieldConfig.name === scalarName) {
        // @ts-ignore
        fieldConfig.serialize = mapper.serialize;
        // @ts-ignore
        fieldConfig.parseValue = mapper.parseValue;
      }
      return fieldConfig;
    }
  });
}


export function string(scalarName: string): (schema: GraphQLSchema) => GraphQLSchema {
  const stringHandler = new TypeHandlerString();
  return schema =>
    mapSchema(schema, {
      [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
        if (fieldConfig.name === scalarName) {
          // @ts-ignore
          fieldConfig.serialize = (value: Term) => {
            if (value.termType !== 'Literal') {
              throw new Error(`Expected Literal term, instead received ${value.value} of type ${value.termType}`);  
            }

            if (value.datatype.termType !== 'NamedNode') {
              throw new Error(`Expected datatype to be a NamedNode, instead received ${value.datatype.value} of type ${value.datatype.termType}`)
            }

            if (!TypeHandlerString.TYPES.includes(value.datatype.value)) {
              throw new Error(`Expected a string type, instead received ${value.datatype.value}`)
            }

            const result = stringHandler.fromRdf(value);

            if (typeof result !== 'string') {
              throw new Error(`Expected node to have string value, instead received ${result} of type ${typeof result}`)
            }

            return result;
          }
          // @ts-ignore
          fieldConfig.parseValue = (value: string) => {
            if (typeof value !== 'string') {
              throw new Error(`Expected string, received ${value} of type ${typeof value}`);
            }

            return stringHandler.toRdf(
              value,
              { dataFactory: DF, datatype: DF.namedNode('http://www.w3.org/2001/XMLSchema#string') }
            );

            // TODO: Include parsing directives to specify datatype
            // return DF.literal(value, DF.namedNode('http://www.w3.org/2001/XMLSchema#string'));
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return parseValue(DF.namedNode(value));
          }
        }
        return fieldConfig;
      }
    })
}


export function date(scalarName: string): (schema: GraphQLSchema) => GraphQLSchema {
  const dateHandler = new TypeHandlerDate();
  return schema =>
    mapSchema(schema, {
      [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
        if (fieldConfig.name === scalarName) {
          // @ts-ignore
          fieldConfig.serialize = (value: Term) => {
            if (value.termType !== 'Literal') {
              throw new Error(`Expected Literal term, instead received ${value.value} of type ${value.termType}`);  
            }

            if (value.datatype.termType !== 'NamedNode') {
              throw new Error(`Expected datatype to be a NamedNode, instead received ${value.datatype.value} of type ${value.datatype.termType}`)
            }

            if (!TypeHandlerDate.TYPES.includes(value.datatype.value)) {
              throw new Error(`Expected a string type, instead received ${value.datatype.value}`)
            }

            const result = dateHandler.fromRdf(value, true);

            if (!(result instanceof Date)) {
              throw new Error(`Expected node to have string value, instead received ${result} of type ${typeof result}`)
            }

            return result;
          }
          // @ts-ignore
          fieldConfig.parseValue = (value: Date) => {
            if (!(value instanceof Date)) {
              throw new Error(`Expected string, received ${value} of type ${typeof value}`);
            }

            // TODO: Include parsing directives to specify datatype
            return dateHandler.toRdf(value, { dataFactory: DF }); // TODO: See if params are needed here (and add tests)
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return parseValue(DF.namedNode(value));
          }
        }
        return fieldConfig;
      }
    })
}

// TODO: See if we should make use of BigInt

export function int(scalarName: string): (schema: GraphQLSchema) => GraphQLSchema {
  const intHandler = new TypeHandlerNumberInteger();
  return schema =>
    mapSchema(schema, {
      [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
        if (fieldConfig.name === scalarName) {
          // @ts-ignore
          fieldConfig.serialize = (value: Term) => {
            if (value.termType !== 'Literal') {
              throw new Error(`Expected Literal term, instead received ${value.value} of type ${value.termType}`);  
            }

            if (value.datatype.termType !== 'NamedNode') {
              throw new Error(`Expected datatype to be a NamedNode, instead received ${value.datatype.value} of type ${value.datatype.termType}`)
            }

            if (!TypeHandlerNumberInteger.TYPES.includes(value.datatype.value)) {
              throw new Error(`Expected a string type, instead received ${value.datatype.value}`)
            }

            const result = intHandler.fromRdf(value, true);

            if (typeof result === 'number') {
              throw new Error(`Expected node to have number value, instead received ${result} of type ${typeof result}`)
            }

            return result;
          }
          // @ts-ignore
          fieldConfig.parseValue = (value: number) => {
            if (typeof value === 'number') {
              throw new Error(`Expected node to have number value, instead received ${value} of type ${typeof value}`)
            }

            // TODO: Include parsing directives to specify datatype
            return intHandler.toRdf(value, { dataFactory: DF }); // TODO: See if params are needed here (and add tests)
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return parseValue(DF.namedNode(value));
          }
        }
        return fieldConfig;
      }
    })
}


export function float(scalarName: string): (schema: GraphQLSchema) => GraphQLSchema {
  const doubleHandler = new TypeHandlerNumberDouble();
  return schema =>
    mapSchema(schema, {
      [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
        if (fieldConfig.name === scalarName) {
          // @ts-ignore
          fieldConfig.serialize = (value: Term) => {
            if (value.termType !== 'Literal') {
              throw new Error(`Expected Literal term, instead received ${value.value} of type ${value.termType}`);  
            }

            if (value.datatype.termType !== 'NamedNode') {
              throw new Error(`Expected datatype to be a NamedNode, instead received ${value.datatype.value} of type ${value.datatype.termType}`)
            }

            if (!TypeHandlerNumberDouble.TYPES.includes(value.datatype.value)) {
              throw new Error(`Expected a string type, instead received ${value.datatype.value}`)
            }

            const result = doubleHandler.fromRdf(value, true);

            if (typeof result === 'number') {
              throw new Error(`Expected node to have number value, instead received ${result} of type ${typeof result}`)
            }

            return result;
          }
          // @ts-ignore
          fieldConfig.parseValue = (value: number) => {
            if (typeof value === 'number') {
              throw new Error(`Expected node to have number value, instead received ${value} of type ${typeof value}`)
            }

            // TODO: Include parsing directives to specify datatype
            return doubleHandler.toRdf(value, { dataFactory: DF }); // TODO: See if params are needed here (and add tests)
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return parseValue(DF.namedNode(value));
          }
        }
        return fieldConfig;
      }
    })
}

export function url(scalarName: string): (schema: GraphQLSchema) => GraphQLSchema {
  // const dateHandler = new TypeHandlerDate();
  const anyURI = 'http://www.w3.org/2001/XMLSchema#anyURI';
  return schema =>
    mapSchema(schema, {
      [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
        if (fieldConfig.name === scalarName) {
          // @ts-ignore
          fieldConfig.serialize = (value: Term) => {
            if (value.termType !== 'Literal') {
              throw new Error(`Expected Literal term, instead received ${value.value} of type ${value.termType}`);  
            }

            if (value.datatype.termType !== 'NamedNode') {
              throw new Error(`Expected datatype to be a NamedNode, instead received ${value.datatype.value} of type ${value.datatype.termType}`)
            }

            if (value.datatype.value !== anyURI) {
              throw new Error(`Expected a anyURI type, instead received ${value.datatype.value}`)
            }

            const v = value.value;

            if (typeof v !== 'string') {
              throw new Error('Expected node to have string value')
            }

            return new URL(v);
          }
          // @ts-ignore
          fieldConfig.parseValue = (value: URL) => {
            if (!(value instanceof URL)) {
              throw new Error(`Expected URL, received ${value} of type ${typeof value}`);
            }

            return DF.literal(value.href, DF.namedNode(anyURI));
            // TODO: Include parsing directives to specify datatype
            // return dateHandler.toRdf(value, { dataFactory: DF }); // TODO: See if params are needed here (and add tests)
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return parseValue(DF.namedNode(value));
          }
        }
        return fieldConfig;
      }
    })
}

// export function URL() {
//   'http://www.w3.org/2001/XMLSchema#anyURI'
// }

export function ID(scalarName: string): (schema: GraphQLSchema) => GraphQLSchema {
  return schema =>
    mapSchema(schema, {
      [MapperKind.SCALAR_TYPE]: (fieldConfig) => {
        if (fieldConfig.name === scalarName) {
          // const { serialize, parseValue } = fieldConfig;
          // @ts-ignore
          fieldConfig.serialize = (value: Term) => {
            if (value.termType !== 'NamedNode') {
              throw new Error(`Expected @${scalarName} to be a NamedNode`);
            }
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return serialize(value.value);
            return value.value
          }
          // @ts-ignore
          fieldConfig.parseValue = (value: string) => {
            if (typeof value !== 'string') {
              throw new Error(`Expected string, received ${value} of type ${typeof value}`);
            }
            return DF.namedNode(value);
            // TODO: Re-enable this once we work out what is causing side effects in the test suite
            // return parseValue(DF.namedNode(value));
          }
        }
        return fieldConfig;
      }
    })
}