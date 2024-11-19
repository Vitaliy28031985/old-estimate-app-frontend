// // estimateApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API_URL;

export const estimateApi = createApi({
  reducerPath: 'estimateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Estimate'],
  endpoints: builder => ({
    addEstimate: builder.mutation({
      query: param => ({
        url: `estimates/${param.id}`,
        method: 'POST',
        body: param.estimates,
      }),
  
      invalidatesTags: ['Estimate'],
    }) ,
    updateEstimate: builder.mutation({
     
      query: ([prjId, estId, newData ]) => ({
        url: `estimates/${prjId}/${estId}`,
        method: 'PATCH',
        body: newData, 
      
      }),
      invalidatesTags: ['Estimate'],
    }),
    deleteEstimate: builder.mutation({
        query: param => ({
          url: `estimates/${param.idPro}/${param.idEst}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Estimate'],
      }),

  }),
});

export const {
  useAddEstimateMutation,
  useUpdateEstimateMutation,
  useDeleteEstimateMutation
} = estimateApi;


  // // query: param =>{ 
    //     console.log(param.estimates)

    //     ({
    //     url: `estimates/${param.id}`,
    //     method: 'POST',
    //     body: param.estimates,
    //   })
    //   console.log()
    // },
    // query: param => ({
    //     url: `estimates/65902ece8d13de584b47ef2e`,
    //     method: 'POST',
    //     body: param.estimates,
    //   }),