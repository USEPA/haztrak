import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ManifestStatus, SiteType } from '~/components/Manifest/manifestSchema';

export interface HandlerSearchConfig {
  siteType: SiteType;
  open: boolean;
}

export interface ManifestSlice {
  status?: ManifestStatus;
  readOnly?: boolean;
  handlerSearch?: HandlerSearchConfig;
}

const initialState: ManifestSlice = {
  readOnly: undefined,
  status: undefined,
};

export const manifestSlice = createSlice({
  name: 'manifest',
  initialState,
  selectors: {
    selectManifestStatus: (state) => state.status,
    selectManifestReadOnly: (state) => state.readOnly,
    selectManifestEditable: (state) => !state.readOnly,
    selectHandlerSearchConfigs: (state) => state.handlerSearch,
  },
  reducers: {
    setManifestStatus: (state, action: PayloadAction<ManifestStatus | undefined>) => {
      state.status = action.payload;
    },
    setManifestReadOnly: (state, action: PayloadAction<boolean>) => {
      state.readOnly = action.payload;
    },
    setHandlerSearchConfigs: (state, action: PayloadAction<HandlerSearchConfig | undefined>) => {
      state.handlerSearch = action.payload;
    },
  },
});

export default manifestSlice.reducer;
export const { setManifestStatus, setManifestReadOnly, setHandlerSearchConfigs } =
  manifestSlice.actions;
export const { selectManifestStatus, selectManifestReadOnly, selectHandlerSearchConfigs } =
  manifestSlice.selectors;
