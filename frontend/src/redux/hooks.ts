import { useSelector as useSelectorParent, useDispatch as useDispatchParent, TypedUseSelectorHook } from 'react-redux';

import { AppDispatch, RootState } from './store';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorParent;
export const useDispatch: () => AppDispatch = useDispatchParent;
