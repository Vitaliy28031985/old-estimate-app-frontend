import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const settingProjectApi = createApi({
    reducerPath: 'settingProjectApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${apiUrl}setting/project`,
      prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    }),
    tagTypes: ['SettingProject'],
    endpoints: builder => ({
      
    addAllow: builder.mutation({
        query: ([id, data]) => ({
          url: `add/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['SettingProject'],
      }),
    updateAllow: builder.mutation({
        query: ([id, data]) => ({
          url: `update/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['SettingProject'],
    }),
    deleteAllow: builder.mutation({
        query: ([id, data]) => ({
          url: `delete/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['SettingProject'],
      }),
      addDiscount: builder.mutation({
        query:  data => ({
          url: `discount/${data.id}`,
          method: 'POST',
          body: {discount: data.discount},
        }),
        invalidatesTags: ['SettingProject'],
      }),
      addLow: builder.mutation({
        query: (data) => ({
          url: `lowEstimates/${data.id}`,
          method: 'POST',
          body: {discount: data.discount},
        }),
        invalidatesTags: ['SettingProject'],
      }),
    }),
  });

  export const {
    useAddAllowMutation,
    useUpdateAllowMutation,
    useDeleteAllowMutation,
    useAddDiscountMutation,
    useAddLowMutation
  } = settingProjectApi;

