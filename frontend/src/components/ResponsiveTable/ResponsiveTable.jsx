// Componente de tabla responsive
import { useResponsive } from '../../hooks/useResponsive'
import './ResponsiveTable.css'

function ResponsiveTable({ 
  data, 
  columns, 
  className = '',
  onRowClick,
  emptyMessage = 'No hay datos disponibles'
}) {
  const { isMobile, isTablet } = useResponsive()

  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <div className="responsive-table-empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  // En móviles, mostrar como cards
  if (isMobile) {
    return (
      <div className={`responsive-table-mobile ${className}`}>
        {data.map((row, index) => (
          <div 
            key={index} 
            className="table-card"
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="table-card-field">
                <span className="field-label">{column.header}</span>
                <span className="field-value">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  // En tablets y desktop, mostrar como tabla normal
  return (
    <div className={`responsive-table-container ${className}`}>
      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="table-header">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index} 
                className="table-row"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResponsiveTable
