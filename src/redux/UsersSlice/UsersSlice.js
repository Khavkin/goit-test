import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { mockApi } from '../../services/api/mockapi';

const initialState = {
  users: [],
  loadMore: true,
  filter: 'All',
  isLoading: false,
  isError: false,
  page: 1,
};

const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },

    setLoadMore: (state, action) => {
      state.loadMore = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      isAnyOf(
        mockApi.endpoints.getUsersByPage.matchPending,
        mockApi.endpoints.updateUserById.matchPending
      ),
      state => {
        console.log('Pending...');
        state.isLoading = true;
        state.isError = false;
      }
    );
    builder.addMatcher(mockApi.endpoints.getUsersByPage.matchFulfilled, (state, { payload }) => {
      console.log('getUSerbyPage', payload);
      state.users = [...state.users, ...payload];

      if (payload.length === 3) {
        console.log('set loadMore=true');
        state.loadMore = true;
      } else {
        console.log('set loadMore=false');
        state.loadMore = false;
      }
      state.isLoading = false;
      state.isError = false;
    });
    builder.addMatcher(mockApi.endpoints.updateUserById.matchFulfilled, (state, { payload }) => {
      const users = [...state.users];
      const index = users.findIndex(user => user.id === payload.id);
      if (index >= 0) {
        users.splice(index, 1, payload);
        state.users = [...users];
      }
    });

    builder.addMatcher(
      isAnyOf(
        mockApi.endpoints.getUsersByPage.matchRejected,
        mockApi.endpoints.updateUserById.matchRejected
      ),
      (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.loadMore = false;
      }
    );
  },
});

export const { setFilter, setLoadMore, setPage } = UsersSlice.actions;

export const usersReducer = UsersSlice.reducer;
