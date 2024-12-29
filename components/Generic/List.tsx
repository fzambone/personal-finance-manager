import { safeDisplay } from "@/utils/display";

type GenericListProps<T> = {
  data: T[];
  columns: Columns<T>[];
};

export type Columns<T> = {
  key: keyof T & string;
  label: string;
  renderCell?: (row: T) => React.ReactNode;
};

export default function GenericList<T>({ columns, data }: GenericListProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {columns.map((column) => (
                <td
                  key={`${i}-${column.key as string}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                >
                  {column.renderCell
                    ? column.renderCell(row)
                    : (row[column.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
