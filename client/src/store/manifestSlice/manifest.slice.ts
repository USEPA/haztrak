import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ManifestStatus } from 'components/Manifest/manifestSchema';

export interface ManifestSlice {
  status?: ManifestStatus;
  readOnly: boolean;
}

const initialState: ManifestSlice = {
  readOnly: true,
  status: 'NotAssigned',
};

export const manifestSlice = createSlice({
  name: 'manifest',
  initialState,
  selectors: {
    selectManifestStatus: (state) => state.status,
    selectManifestReadOnly: (state) => state.readOnly,
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
export const { selectManifestStatus, selectManifestReadOnly } = manifestSlice.selectors;
