import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  URL: URL;
};

export type Human = {
  __typename?: 'Human';
  birthDate?: Maybe<Scalars['Date']>;
  father?: Maybe<Human>;
  id?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  mother?: Maybe<Human>;
  something?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['URL']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  me?: Maybe<Human>;
};

export type Query = {
  __typename?: 'Query';
  me: Human;
};


export type QueryMeArgs = {
  id: Scalars['String'];
};

export type PersonQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PersonQuery = { __typename?: 'Query', me: { __typename?: 'Human', label: string, id?: string | null, something?: boolean | null, birthDate?: Date | null, url?: URL | null, mother?: { __typename?: 'Human', id?: string | null, label: string, something?: boolean | null, birthDate?: Date | null, url?: URL | null } | null, father?: { __typename?: 'Human', id?: string | null, label: string, something?: boolean | null, birthDate?: Date | null, url?: URL | null } | null } };


export const PersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Person"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"mother"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"something"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"father"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"something"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"something"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<PersonQuery, PersonQueryVariables>;