import React, { useEffect, useRef, useState } from 'react';

function appendSuffix(initialTitle: string) {
  return `${initialTitle} | Haztrak'}`;
}

/**
 * Hook to set document title
 *
 * @description Can be used to page the title dynamically or just once per page.
 * By default, it reset the title to the previous title when the component using this hook unmounts
 * @param title {string}
 * @param resetOnUnmount {boolean}
 * @param excludeSuffix {boolean}
 */
function useTitle(title: string, resetOnUnmount = false, excludeSuffix = false) {
  const defaultTitle = useRef(document.title);
  const [dynTitle, setDynTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = `${title}${excludeSuffix ? '' : ' | Haztrak'}`;
  }, [title]);

  useEffect(() => {
    if (typeof dynTitle === 'string')
      document.title = `${dynTitle}${excludeSuffix ? '' : ' | Haztrak'}`;
  }, [dynTitle]);

  useEffect(
    // run on unmount
    () => () => {
      if (!resetOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    []
  );
  return [dynTitle, setDynTitle] as const;
}

export default useTitle;
