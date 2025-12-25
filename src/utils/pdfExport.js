import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportToPDF = async (elementId, filename = 'cv.pdf', isPremium = false) => {
    const element = document.getElementById(elementId)

    if (!element) {
        console.error('Element not found')
        return
    }

    try {
        // Create canvas from the CV element
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        })

        // Calculate dimensions for A4
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgData = canvas.toDataURL('image/png')

        let heightLeft = imgHeight
        let position = 0

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        // Add extra pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
        }

        // Add watermark for non-premium users
        if (!isPremium) {
            const pageCount = pdf.internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i)
                pdf.setFontSize(40)
                pdf.setTextColor(200, 200, 200)
                pdf.text('CVify.com', 105, 150, {
                    align: 'center',
                    angle: 45
                })
            }
        }

        // Download PDF
        pdf.save(filename)

        return true
    } catch (error) {
        console.error('PDF export failed:', error)
        return false
    }
}

export const printCV = (elementId) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CV - Yazdır</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
    </body>
    </html>
  `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
        printWindow.print()
        printWindow.close()
    }, 500)
}
