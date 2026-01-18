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
            scale: 1.5, // Reduced from 2 to save size while keeping quality for print
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 0
        })

        // Calculate dimensions for A4
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Create PDF with compression enabled
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true
        })

        // Use JPEG instead of PNG for smaller file size
        // Quality 0.8 is the sweet spot for balance between size and sharpness
        const imgData = canvas.toDataURL('image/jpeg', 0.8)

        let heightLeft = imgHeight
        let position = 0

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight

        // Add extra pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
            heightLeft -= pageHeight
        }

        // Add watermark for non-premium users
        if (!isPremium) {
            const pageCount = pdf.internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i)
                pdf.setFontSize(40)
                pdf.setTextColor(200, 200, 200)
                pdf.text('CVniz.com', 105, 150, {
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

export const exportToPNG = async (elementId, filename = 'cv.png') => {
    const element = document.getElementById(elementId)
    if (!element) return false

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        })
        const link = document.createElement('a')
        link.download = filename
        link.href = canvas.toDataURL('image/png')
        link.click()
        return true
    } catch (error) {
        console.error('PNG export failed:', error)
        return false
    }
}

export const exportToJSON = (cvData, filename = 'cv.json') => {
    try {
        const dataStr = JSON.stringify(cvData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
        const link = document.createElement('a')
        link.download = filename
        link.href = dataUri
        link.click()
        return true
    } catch (error) {
        console.error('JSON export failed:', error)
        return false
    }
}

export const exportToHTML = (elementId, filename = 'cv.html') => {
    const element = document.getElementById(elementId)
    if (!element) return false

    try {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>CV - Export</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }
                    .export-container { max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                </style>
            </head>
            <body>
                <div class="export-container">
                    ${element.innerHTML}
                </div>
            </body>
            </html>
        `
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        return true
    } catch (error) {
        console.error('HTML export failed:', error)
        return false
    }
}

export const exportToDOCX = (elementId, filename = 'cv.docx') => {
    const element = document.getElementById(elementId)
    if (!element) return false

    try {
        // Basic HTML-to-DOCX simulation using blob and header for Word
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export DOCX</title></head><body>"
        const footer = "</body></html>"
        const sourceHTML = header + element.innerHTML + footer

        const blob = new Blob(['\ufeff', sourceHTML], {
            type: 'application/msword'
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        return true
    } catch (error) {
        console.error('DOCX export failed:', error)
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

