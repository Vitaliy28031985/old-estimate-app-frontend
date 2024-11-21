import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const lowEstimateApi = createApi({
  reducerPath: 'lowEstimateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}low/estimate`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['lowEstimate'],
  endpoints: builder => ({
    addLowEstimate: builder.mutation({
      query: param => ({
        url: `/${param.id}`,
        method: 'POST',
        body: param.estimates,
      }),
  
      invalidatesTags: ['lowEstimate'],
    }) ,
    updateLowEstimate: builder.mutation({
     
      query: ([prjId, estId, newData ]) => ({
        url: `/${prjId}/${estId}`,
        method: 'PATCH',
        body: newData, 
      
      }),
      invalidatesTags: ['lowEstimate'],
    }),
    deleteLowEstimate: builder.mutation({
        query: param => ({
          url: `/${param.idPro}/${param.idEst}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['lowEstimate'],
      }),

  }),
});

export const {
  useAddLowEstimateMutation,
  useUpdateLowEstimateMutation,
  useDeleteLowEstimateMutation
} = lowEstimateApi;