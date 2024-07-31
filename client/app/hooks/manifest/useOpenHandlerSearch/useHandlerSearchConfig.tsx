import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  HandlerSearchConfig,
  selectHandlerSearchConfigs,
  setHandlerSearchConfigs,
} from '~/store/manifestSlice/manifest.slice';

/** hook used to control the handler Search Form modal
 * @example const [open, setOpen] = useOpenHandlerSearch();
 * */
export function useHandlerSearchConfig() {
  const dispatch = useAppDispatch();
  const [configs, setConfigs] = useState<HandlerSearchConfig | undefined>(undefined);
  const reduxConfigs = useAppSelector(selectHandlerSearchConfigs);

  useEffect(() => {
    dispatch(setHandlerSearchConfigs(configs));
  }, [configs]);

  useEffect(() => {
    setConfigs(reduxConfigs);
  }, [reduxConfigs]);

  /** Set the Modal as open or closed*/
  const handleConfigChange = (handlerSearchConfig: HandlerSearchConfig | undefined) => {
    setConfigs(handlerSearchConfig);
  };

  return [configs, handleConfigChange] as const;
}
