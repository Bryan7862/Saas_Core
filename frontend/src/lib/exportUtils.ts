/**
 * Export utilities for reports
 * Uses native browser APIs (no external libraries needed)
 */

// ============ CSV/EXCEL EXPORT ============

interface ExportColumn {
    header: string;
    key: string;
    format?: (value: any) => string;
}

/**
 * Exports data to CSV format (opens as Excel)
 */
export const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[],
    filename: string
) => {
    if (data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // BOM for Excel to recognize UTF-8
    const BOM = '\uFEFF';

    // Header row
    const headers = columns.map(col => `"${col.header}"`).join(',');

    // Data rows
    const rows = data.map(item =>
        columns.map(col => {
            let value = item[col.key];
            if (col.format) {
                value = col.format(value);
            }
            // Escape quotes and wrap in quotes
            const stringValue = String(value ?? '').replace(/"/g, '""');
            return `"${stringValue}"`;
        }).join(',')
    ).join('\n');

    const csv = BOM + headers + '\n' + rows;

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${formatDateForExport()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// ============ PDF EXPORT (SIMPLE) ============

/**
 * Opens print dialog for PDF generation (browser native)
 */
export const exportToPDFPrint = (
    title: string,
    content: string
) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Por favor permita las ventanas emergentes para generar el PDF');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    padding: 40px; 
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 { 
                    color: #1e40af; 
                    border-bottom: 2px solid #e5e7eb; 
                    padding-bottom: 10px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px;
                    font-size: 12px;
                }
                th { 
                    background: #f3f4f6; 
                    text-align: left; 
                    padding: 12px 8px;
                    font-weight: 600;
                    border-bottom: 2px solid #e5e7eb;
                }
                td { 
                    padding: 10px 8px; 
                    border-bottom: 1px solid #e5e7eb;
                }
                tr:nth-child(even) { background: #f9fafb; }
                .meta { 
                    color: #6b7280; 
                    font-size: 12px; 
                    margin-bottom: 20px;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #9ca3af;
                    font-size: 11px;
                }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="meta">Generado el ${new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</div>
            ${content}
            <div class="footer">Documento generado automáticamente</div>
            <script>
                window.onload = function() { 
                    window.print(); 
                    window.onafterprint = function() { window.close(); }
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};

/**
 * Creates HTML table from data
 */
export const createHTMLTable = <T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[]
): string => {
    const headers = columns.map(col => `<th>${col.header}</th>`).join('');
    const rows = data.map(item =>
        `<tr>${columns.map(col => {
            let value = item[col.key];
            if (col.format) {
                value = col.format(value);
            }
            return `<td>${value ?? '-'}</td>`;
        }).join('')}</tr>`
    ).join('');

    return `
        <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
};

// ============ HELPERS ============

const formatDateForExport = (): string => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
};

/**
 * Format currency for exports
 */
export const formatCurrencyExport = (value: number): string => {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date for exports
 */
export const formatDateExport = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};
