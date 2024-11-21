import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './auth/authApi';
import { userApi } from './user/userApi';
import { projectsApi } from './projectSlice/projectSlice';
import {priceApi} from "./price/priceApi";
import {estimateApi} from "./estimate/estimateApi" ;
import {positionApi} from "./position/positionApi";
import {materialApi} from "./material/materialApi";
import {advanceApi} from "./advances/advancesApi";
import {unitsApi} from "./unit/unitApi";
import { projectPriceApi } from "./projectPrice/projectPriceApi";
import { settingProjectApi } from "./SettingProject/SettingProjectApi";
import { lowEstimateApi } from "./lowEstimate/lowEstimateApi";
import { lowPositionApi } from "./lowPosition/lowPositionApi";
import { lowProjectPriceApi } from "./lowProjectPrice/lowProjectPriceApi";

import authReducer from './auth/authSlice';

const persistConfig = {
  key: 'auth',
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authReducer),
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [priceApi.reducerPath]: priceApi.reducer,
    [estimateApi.reducerPath]: estimateApi.reducer,
    [positionApi.reducerPath]: positionApi.reducer,
    [materialApi.reducerPath]: materialApi.reducer,
    [advanceApi.reducerPath]: advanceApi.reducer,
    [unitsApi.reducerPath]: unitsApi.reducer,
    [projectPriceApi.reducerPath]: projectPriceApi.reducer,
    [settingProjectApi.reducerPath]: settingProjectApi.reducer,
    [lowEstimateApi.reducerPath]: lowEstimateApi.reducer,
    [lowPositionApi.reducerPath]: lowPositionApi.reducer,
    [lowProjectPriceApi.reducerPath]: lowProjectPriceApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, userApi.middleware, projectsApi.middleware, priceApi.middleware, estimateApi.middleware, positionApi.middleware, materialApi.middleware,
      advanceApi.middleware, unitsApi.middleware, projectPriceApi.middleware, settingProjectApi.middleware, lowEstimateApi.middleware, lowPositionApi.middleware, lowProjectPriceApi.middleware),
});

export const persistor = persistStore(store);
