import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ManifestStatus } from 'components/Manifest/manifestSchema';

export interface ManifestSlice {
  status?: ManifestStatus;
}

const initialState: ManifestSlice = {
  status: 'NotAssigned',
};

export const manifestSlice = createSlice({
  name: 'manifest',
  initialState,
  selectors: {
    selectManifestStatus: (state) => state.status,
  },
  reducers: {
    setStatus: (state, action: PayloadAction<ManifestStatus>) => {
      return {
        ...state,
        status: action.payload,
      };
    },
  },
});

export default manifestSlice.reducer;
export const { setStatus } = manifestSlice.actions;
export const { selectManifestStatus } = manifestSlice.selectors;
