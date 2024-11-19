import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}user`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    current: builder.query({
      query: () => `/current`,
      providesTags: ['User'],
    }),
    changeUser: builder.mutation({
      query: (newData) => ({
        url: `/name`,
        method: 'PUT',
        body: newData,
      }),
      invalidatesTags: ['User'],
    }),
    changeEmail: builder.mutation({
      query: ( newData) => ({
        url: `/email`,
        method: 'PUT',
        body: newData, 
      
      }),
      invalidatesTags: ['User'],
    }),
    changePhone: builder.mutation({
      query: data => ({
        url: `/phone`,
        method: 'PUT',
        body: data, 
      }),
      invalidatesTags: ['User'],
    }),
    changeRole: builder.mutation({
      query: data => ({
        url: `/role`,
        method: 'PUT',
        body: data, 
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: data => ({
        url: `/password`,
        method: 'PUT',
        body: data, 
      }),
      invalidatesTags: ['User'],
    }),

    changeAvatar: builder.mutation({
      query: data => ({
        url: `/avatar`,
        method: 'PUT',
        body: data, 
      }),
      invalidatesTags: ['User'],
    }),

    // getUsers: builder.query({
    //   query: () => `/`,
    //   providesTags: ['User'],
    // }),
  }),
});

export const {
    useCurrentQuery,
    useChangeUserMutation,
    useChangeEmailMutation,
    useChangePhoneMutation,
    useChangeRoleMutation
  } = userApi;