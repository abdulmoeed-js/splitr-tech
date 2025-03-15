
export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground">Loading your data...</p>
    </div>
  );
}
