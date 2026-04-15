import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse, InfiniteResponse } from '@/types';

export type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<ApiResponse<TData>, Error, TVariables, unknown>,
  'mutationFn'
>;

export type UseQueryCustomOptions<TData = unknown, TSelected = ApiResponse<TData>> = Omit<
  UseQueryOptions<ApiResponse<TData>, Error, TSelected, QueryKey>,
  'queryKey' | 'queryFn'
>;

export type UseInfiniteQueryCustomOptions<TData = unknown, TPageParam = number> = Omit<
  UseInfiniteQueryOptions<
    ApiResponse<InfiniteResponse<TData>>,
    Error,
    InfiniteData<ApiResponse<InfiniteResponse<TData>>>,
    QueryKey,
    TPageParam
  >,
  'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
>;
