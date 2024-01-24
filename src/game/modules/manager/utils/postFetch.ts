export interface PostOptions {
  headers?: HeadersInit;
  variables?: Record<string, any>;
}

export interface PostError {
  message?: string;
  [key: string]: any;
}

const baseUrl = "https://basiliskgaming.com";

export const postFetch = async <ResultType extends Record<string, any>>(
  queryString: string,
  options?: PostOptions
) => {
  interface PostResult {
    data?: ResultType;
    error?: PostError;
  }

  let query = `${baseUrl}/${queryString}`;
  const { headers, variables } = options || {};

  try {
    const queryHeaders = {
      ...headers,
    };
    const queryBody = JSON.stringify({
      ...variables,
    });

    const response = await fetch(query, {
      method: "POST",
      headers: queryHeaders,
      body: queryBody,
      cache: "no-cache",
    });

    const result = await response.json();

    const postResult = {} as PostResult;
    if (result?.success) postResult.data = result;
    else postResult.error = result;

    return postResult;
  } catch (error) {
    const message = error || "Something went wrong";

    return { error: { message } } as PostResult;
  }
};
