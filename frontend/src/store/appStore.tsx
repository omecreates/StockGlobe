import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { User, ModalState, ToastConfig, Prediction, Market } from "@/types";

// ─── Safe localStorage (works on SSR too) ─────────────────────────────────────
function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}
function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

// ─── State shape ──────────────────────────────────────────────────────────────
interface AppState {
  user: User | null;
  token: string | null;
  modals: ModalState;
  toasts: ToastConfig[];
}

const INITIAL_STATE: AppState = {
  user: (() => {
    try {
      const raw = safeGet("predictafi_user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch { return null; }
  })(),
  token: safeGet("predictafi_token"),
  modals: {
    demo: false,
    requestAccess: false,
    auth: null,
    predictionDetail: null,
    marketDetail: null,
  },
  toasts: [],
};

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: "AUTH_LOGIN"; user: User; token: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "MODAL_OPEN_DEMO" }
  | { type: "MODAL_OPEN_REQUEST_ACCESS" }
  | { type: "MODAL_OPEN_AUTH"; mode: "login" | "signup" }
  | { type: "MODAL_OPEN_PREDICTION"; prediction: Prediction }
  | { type: "MODAL_OPEN_MARKET"; market: Market }
  | { type: "MODAL_CLOSE_ALL" }
  | { type: "TOAST_ADD"; toast: ToastConfig }
  | { type: "TOAST_REMOVE"; id: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "AUTH_LOGIN":
      safeSet("predictafi_token", action.token);
      safeSet("predictafi_user", JSON.stringify(action.user));
      return { ...state, user: action.user, token: action.token };
    case "AUTH_LOGOUT":
      safeRemove("predictafi_token");
      safeRemove("predictafi_user");
      return { ...state, user: null, token: null };
    case "MODAL_OPEN_DEMO":
      return { ...state, modals: { ...state.modals, demo: true } };
    case "MODAL_OPEN_REQUEST_ACCESS":
      return { ...state, modals: { ...state.modals, requestAccess: true } };
    case "MODAL_OPEN_AUTH":
      return { ...state, modals: { ...state.modals, auth: action.mode } };
    case "MODAL_OPEN_PREDICTION":
      return { ...state, modals: { ...state.modals, predictionDetail: action.prediction } };
    case "MODAL_OPEN_MARKET":
      return { ...state, modals: { ...state.modals, marketDetail: action.market } };
    case "MODAL_CLOSE_ALL":
      return {
        ...state,
        modals: { demo: false, requestAccess: false, auth: null, predictionDetail: null, marketDetail: null },
      };
    case "TOAST_ADD":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "TOAST_REMOVE":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  openDemo: () => void;
  openRequestAccess: () => void;
  openAuth: (mode: "login" | "signup") => void;
  openPredictionDetail: (prediction: Prediction) => void;
  openMarketDetail: (market: Market) => void;
  closeAllModals: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  addToast: (config: Omit<ToastConfig, "id">) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const openDemo = useCallback(() => dispatch({ type: "MODAL_OPEN_DEMO" }), []);
  const openRequestAccess = useCallback(() => dispatch({ type: "MODAL_OPEN_REQUEST_ACCESS" }), []);
  const openAuth = useCallback((mode: "login" | "signup") => dispatch({ type: "MODAL_OPEN_AUTH", mode }), []);
  const openPredictionDetail = useCallback((prediction: Prediction) => dispatch({ type: "MODAL_OPEN_PREDICTION", prediction }), []);
  const openMarketDetail = useCallback((market: Market) => dispatch({ type: "MODAL_OPEN_MARKET", market }), []);
  const closeAllModals = useCallback(() => dispatch({ type: "MODAL_CLOSE_ALL" }), []);
  const login = useCallback((user: User, token: string) => dispatch({ type: "AUTH_LOGIN", user, token }), []);
  const logout = useCallback(() => dispatch({ type: "AUTH_LOGOUT" }), []);

  const addToast = useCallback((config: Omit<ToastConfig, "id">) => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: "TOAST_ADD", toast: { ...config, id } });
    const duration = config.duration ?? 4000;
    if (duration > 0) setTimeout(() => dispatch({ type: "TOAST_REMOVE", id }), duration);
  }, []);

  const removeToast = useCallback((id: string) => dispatch({ type: "TOAST_REMOVE", id }), []);

  return (
    <AppContext.Provider value={{
      state, dispatch,
      openDemo, openRequestAccess, openAuth,
      openPredictionDetail, openMarketDetail, closeAllModals,
      login, logout, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
