import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ManifestStatus } from 'components/Manifest/manifestSchema';

export interface ManifestSlice {
  status?: ManifestStatus;
  readOnly: boolean;
}

const initialState: ManifestSlice = {
  readOnly: true,
  status: undefined,
};

export const manifestSlice = createSlice({
  name: 'manifest',
  initialState,
  selectors: {
    selectManifestStatus: (state) => state.status,
    selectManifestReadOnly: (state) => state.readOnly,
  },
  reducers: {
    setManifestStatus: (state, action: PayloadAction<ManifestStatus | undefined>) => {
      return {
        ...state,
        status: action.payload,
      };
    },
  },
});

export default manifestSlice.reducer;
export const { setManifestStatus } = manifestSlice.actions;
export const { selectManifestStatus, selectManifestReadOnly } = manifestSlice.selectors;
