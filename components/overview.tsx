export function Overview() {
  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold text-lg">Overview</span>
      </div>
      <div className="border rounded-lg mt-2 grid grid-cols-4 py-3 bg-secondary/20">
        <div className="flex flex-col items-center justify-center border-r">
          <span className="text-sm text-muted-foreground">Total volume</span>
          <span className="font-semibold">$99,999,999</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r">
          <span className="text-sm text-muted-foreground">Traders</span>
          <span className="font-semibold">99,999</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r">
          <span className="text-sm text-muted-foreground">Orders</span>
          <span className="font-semibold">999,999</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">
            Value of Buymore
          </span>
          <span className="font-semibold">$99,999,999</span>
        </div>
      </div>
    </div>
  );
}
