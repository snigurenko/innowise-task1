import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Typed wrappers so every call site gets full autocomplete/type-checking
// instead of casting `state: any` each time — same reasoning as typing a
// Pinia store's state/getters.
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
