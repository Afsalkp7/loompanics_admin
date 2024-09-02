import React from 'react';

/**
 * Reusable Table Component
 * @param {Array} columns - Array of column objects with `key` and `label`.
 * @param {Array} data - Array of row objects containing data for each row.
 * @param {Function} renderActions - Optional function to render actions for each row.
 */
const Table = ({ columns, data, renderActions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-00">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-2 px-4 text-left">
                {column.label}
              </th>
            ))}
            {renderActions && <th className="py-2 px-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b">
              {columns.map((column) => (
                <td key={column.key} className="py-2 px-4">
                  {row[column.key]}
                </td>
              ))}
              {renderActions && (
                <td className="py-2 px-4">{renderActions(row, index)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
