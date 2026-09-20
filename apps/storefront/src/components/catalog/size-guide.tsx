import { Dialog } from "../ui/dialog";
export function SizeTable() {
  return (
    <>
      <p className="muted">
        Find your comfortable fit. Body measurements are in inches and are a
        helpful starting point.
      </p>
      <div className="table-scroll">
        <table className="size-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest</th>
              <th>Waist</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["S", "36–38", "28–30", "27"],
              ["M", "38–40", "30–32", "28"],
              ["L", "40–42", "32–34", "29"],
              ["XL", "42–44", "34–36", "30"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={index} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={index}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted">
        Between sizes? Choose the larger size for a relaxed fit. Measure around
        the fullest part of your chest and your natural waist.
      </p>
    </>
  );
}
export function SizeGuide({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog title="A fit that feels like you" open={open} onClose={onClose}>
      <SizeTable />
    </Dialog>
  );
}
