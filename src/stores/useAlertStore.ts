import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type: 'ALERT' | 'CONFIRM';
  resolve?: (confirmed: boolean) => void;
}

type AlertDialogConfig = Omit<AlertDialogState, 'isOpen' | 'resolve' | 'type'>;

interface AlertDialogActions {
  showAlert: (config: AlertDialogConfig) => void;
  showConfirmAlert: (config: AlertDialogConfig) => Promise<boolean>;
  hideAlert: () => void;
  confirmAlert: () => void;
  cancelAlert: () => void;
}

const initialState: AlertDialogState = {
  isOpen: false,
  title: '',
  description: '',
  onConfirm: undefined,
  onCancel: undefined,
  confirmText: '확인',
  cancelText: '',
  variant: 'default',
  size: 'md',
  type: 'ALERT',
  resolve: undefined,
};

export const alertStore = create<AlertDialogState & AlertDialogActions>((set, get) => ({
  ...initialState,

  // Actions
  showAlert: (config) => {
    set({
      ...initialState,
      ...config,
      isOpen: true,
    });
  },

  showConfirmAlert: (config) => {
    return new Promise<boolean>((resolve) => {
      set({
        ...initialState,
        ...config,
        isOpen: true,
        type: 'CONFIRM',
        resolve,
      });
    });
  },

  // 닫힘 애니메이션 중 type/버튼 구성이 바뀌어 기본 알럿이 번쩍이는 현상을 막기 위해
  // 닫을 때는 isOpen 만 끄고 나머지 필드는 그대로 둔다. 다음 show* 호출에서 initialState 가 전개되며 덮어쓰임.
  hideAlert: () => {
    const { resolve } = get();
    resolve?.(false);
    set({ isOpen: false, resolve: undefined });
  },

  confirmAlert: () => {
    const { onConfirm, resolve } = get();
    onConfirm?.();
    resolve?.(true);
    set({ isOpen: false, resolve: undefined });
  },

  cancelAlert: () => {
    const { onCancel, resolve } = get();
    onCancel?.();
    resolve?.(false);
    set({ isOpen: false, resolve: undefined });
  },
}));

const useAlertStore = () =>
  alertStore(
    useShallow((state) => ({
      showConfirmAlert: state.showConfirmAlert,
      showAlert: state.showAlert,
    }))
  );

export default useAlertStore;
