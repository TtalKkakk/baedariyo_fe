export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  isDestructive = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="relative mx-4 w-full max-w-[328px] rounded-2xl bg-white px-6 py-6">
        <p className="text-center text-h6 font-bold text-[var(--color-semantic-label-normal)]">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-center text-body2 text-[var(--color-semantic-label-alternative)]">
            {description}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 h-10 rounded-lg text-body2 font-semibold text-white ${
              isDestructive
                ? 'bg-[var(--color-semantic-status-negative)]'
                : 'bg-[var(--color-atomic-redOrange-80)]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
