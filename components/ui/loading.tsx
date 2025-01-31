interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Загрузка...' }: LoadingProps) {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 border-4 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
        <p className="text-zinc-400">{message}</p>
      </div>
    </div>
  );
}
