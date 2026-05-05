---
title: "Advanced TypeScript Tricks for Better Code"
excerpt: "Discover powerful TypeScript patterns including conditional types, mapped types, template literal types, and utility types that will transform how you write type-safe code."
date: "2024-03-05"
author: "Alex Morgan"
authorBio: "Full-stack developer and open-source enthusiast. Writes about web development, TypeScript, and building great user experiences."
authorAvatar: "/images/author-alex-morgan.jpg"
tags: ["typescript", "advanced", "patterns", "tips"]
coverImage: "/images/typescript-advanced-patterns.jpg"
readingTime: 15
---

# Advanced TypeScript Tricks for Better Code

TypeScript's type system is incredibly powerful. Beyond basic types and interfaces, there's a whole world of advanced patterns that can make your code more expressive, safer, and easier to maintain.

## Utility Types You Should Know

TypeScript ships with many built-in utility types. Here are the most useful ones:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Pick only specific properties
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Make all properties readonly
type ReadonlyUser = Readonly<User>;

// Create a record type
type UserMap = Record<string, User>;
```

## Conditional Types

Conditional types allow you to create types that depend on other types:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// More practical example
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = T extends null 
  ? { error: string } 
  : { data: T; status: number };
```

## Mapped Types

Mapped types let you transform existing types:

```typescript
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Make all properties async
type Async<T> = {
  [K in keyof T]: Promise<T[K]>;
};

// Create getter methods for all properties
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Config {
  host: string;
  port: number;
}

type ConfigGetters = Getters<Config>;
// { getHost: () => string; getPort: () => number; }
```

## Template Literal Types

Template literal types are incredibly powerful for string manipulation:

```typescript
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// CSS property builder
type CSSProperty = 'margin' | 'padding';
type CSSDirection = 'Top' | 'Right' | 'Bottom' | 'Left';
type CSSDirectionalProperty = `${CSSProperty}${CSSDirection}`;
// 'marginTop' | 'marginRight' | ... | 'paddingLeft'

// API route builder
type APIVersion = 'v1' | 'v2';
type APIEndpoint = 'users' | 'posts' | 'comments';
type APIRoute = `/api/${APIVersion}/${APIEndpoint}`;
```

## Discriminated Unions

Discriminated unions are a pattern for handling different states:

```typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data; // TypeScript knows data exists here
    case 'error':
      return state.error; // TypeScript knows error exists here
  }
}
```

## Infer Keyword

The `infer` keyword lets you extract types from other types:

```typescript
// Extract the return type of a function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract the element type of an array
type ElementType<T> = T extends (infer E)[] ? E : never;

// Extract Promise value type
type Awaited<T> = T extends Promise<infer V> ? V : T;

// Practical example: extract API response type
type APIData<T extends (...args: any[]) => Promise<any>> = 
  Awaited<ReturnType<T>>;

async function fetchUser() {
  return { id: 1, name: 'Alex' };
}

type UserData = APIData<typeof fetchUser>;
// { id: number; name: string }
```

## Branded Types

Branded types prevent mixing up values of the same primitive type:

```typescript
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, 'UserId'>;
type PostId = Brand<number, 'PostId'>;

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = 1 as UserId;
const postId = 2 as PostId;

getUser(userId); // ✅ OK
getUser(postId); // ❌ Error: PostId is not assignable to UserId
```

## Recursive Types

TypeScript supports recursive type definitions:

```typescript
type JSONValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JSONValue[] 
  | { [key: string]: JSONValue };

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

## Conclusion

These advanced TypeScript patterns might seem complex at first, but they become natural with practice. The key is to start using them in real projects — start with utility types, then move to conditional and mapped types as you get comfortable.

The investment in learning TypeScript's type system pays off enormously in code quality, refactoring confidence, and developer experience.
