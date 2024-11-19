import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}auth`,
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
    login: builder.mutation({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
//     login: builder.mutation({
//   query: body => {
//     console.log('Request body:', body);  // Виводимо body в консоль
//     return {
//       url: '/login',
//       method: 'POST',
//       body,
//     };
//   },
// }),
    signup: builder.mutation({
      query: body => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),
  
     google: builder.query({
      query: () => ({
        url: '/google',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useCurrentQuery, useGetUsersQuery, useGoogleQuery,
   useLoginMutation, useSignupMutation,
    useAddAllowMutation, useDeleteAllowMutation, useLogoutMutation, useAddAllowUserMutation,
    useUpdateAllowUserMutation
  } = authApi;
