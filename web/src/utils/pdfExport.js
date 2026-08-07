import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const PDF_PAGE_FORMAT = 'a4'
export const PDF_PAGE_FORMATS = {
    a4: { label: 'A4', widthMm: 210, heightMm: 297 },
    letter: { label: 'Letter', widthMm: 216, heightMm: 279 }
}

export const getPdfPageFormatLabel = (format) => PDF_PAGE_FORMATS[format]?.label || 'A4'
export const getPdfPageSizeMm = (format) => {
    const config = PDF_PAGE_FORMATS[format] || PDF_PAGE_FORMATS.a4
    return { widthMm: config.widthMm, heightMm: config.heightMm }
}

export const exportToPDF = async (elementId, filename = 'cv.pdf', isPremium = false, pageFormat = PDF_PAGE_FORMAT) => {
    let element = document.getElementById(elementId)
    let isIframe = false;

    // If not found in main document, check if it's inside our iframe
    if (!element) {
        const iframe = document.getElementById('cv-preview-iframe');
        if (iframe && iframe.contentDocument) {
            element = iframe.contentDocument.getElementById(elementId);
            isIframe = true;
        }
    }

    if (!element) {
        console.error('Element not found')
        return
    }

    try {
        const { widthMm: imgWidth, heightMm: pageHeightMm } = getPdfPageSizeMm(pageFormat)
        const ratio = pageHeightMm / imgWidth
        
        // --- SMART PAGINATION ENGINE ---
        // Clone the element to mutate it without affecting the live UI
        const clone = element.cloneNode(true)
        clone.style.position = 'absolute'
        clone.style.top = '-99999px'
        clone.style.left = '-99999px'
        clone.style.width = `${element.offsetWidth}px` // Lock width to match original
        // Temporarily append to body to calculate real bounding boxes
        document.body.appendChild(clone)
        
        const pxPageHeight = element.offsetWidth * ratio
        
        // Find all elements that shouldn't be broken across pages
        const avoidItems = Array.from(clone.querySelectorAll('.break-inside-avoid, .page-break-inside-avoid'))
        
        // Process them in DOM order
        avoidItems.forEach((item) => {
            const cloneRect = clone.getBoundingClientRect()
            const itemRect = item.getBoundingClientRect()
            
            const topRelativeToContainer = itemRect.top - cloneRect.top
            const bottomRelativeToContainer = topRelativeToContainer + itemRect.height
            
            const pageOfTop = Math.floor(topRelativeToContainer / pxPageHeight)
            const pageOfBottom = Math.floor(bottomRelativeToContainer / pxPageHeight)
            
            // If the element crosses a page boundary and is smaller than a single page
            if (pageOfBottom > pageOfTop && itemRect.height < pxPageHeight) {
                // Calculate pixels needed to push it to the start of the next page
                const distanceToNextPage = ((pageOfTop + 1) * pxPageHeight) - topRelativeToContainer
                const currentMarginTop = parseFloat(window.getComputedStyle(item).marginTop) || 0
                // Add the distance as margin-top to bump it down
                item.style.marginTop = `${currentMarginTop + distanceToNextPage}px`
            }
        })
        
        // Create canvas from the perfectly paginated clone
        const canvas = await html2canvas(clone, {
            scale: 2, // Keep crisp quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 0
        })
        
        // Cleanup clone
        document.body.removeChild(clone)

        // Calculate final dimensions for PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Create PDF with compression enabled
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: pageFormat,
            compress: true
        })

        // Use JPEG instead of PNG for smaller file size
        // Quality 0.8 is the sweet spot for balance between size and sharpness
        const imgData = canvas.toDataURL('image/jpeg', 0.8)

        let heightLeft = imgHeight
        let position = 0

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeightMm

        // Add extra pages if needed
        while (heightLeft > 1) { // >1 to avoid blank extra pages for rounding errors
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
            heightLeft -= pageHeightMm
        }

        // Add watermark for non-premium users
        if (!isPremium) {
            const pageCount = pdf.internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i)
                // Large diagonal watermark
                pdf.setFontSize(60)
                pdf.setTextColor(220, 220, 220)
                pdf.text('CVniz.com', 105, 140, {
                    align: 'center',
                    angle: 35
                })
                // Secondary watermark at bottom
                pdf.setFontSize(20)
                pdf.setTextColor(180, 180, 180)
                pdf.text('CVniz.com ile oluşturuldu - www.cvniz.com', 105, 280, {
                    align: 'center'
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
    let element = document.getElementById(elementId)
    if (!element) {
        const iframe = document.getElementById('cv-preview-iframe');
        if (iframe && iframe.contentDocument) {
            element = iframe.contentDocument.getElementById(elementId);
        }
    }
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
    let element = document.getElementById(elementId)
    if (!element) {
        const iframe = document.getElementById('cv-preview-iframe');
        if (iframe && iframe.contentDocument) {
            element = iframe.contentDocument.getElementById(elementId);
        }
    }
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

    // Get all style tags and stylesheets from the parent document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(style => style.outerHTML)
        .join('\n');

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CV - Yazdır</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      ${styles}
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        
        /* Global Print Fixes for PDF rendering */
        @media print {
          @page {
             margin: 0;
             size: A4 portrait;
          }
          body { 
             margin: 0; 
             -webkit-print-color-adjust: exact !important; 
             print-color-adjust: exact !important; 
             background: white !important;
          }
          /* Ensure the container fits A4 */
          #${elementId} {
             width: 210mm !important;
             min-height: 297mm !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
             transform: none !important;
             overflow: visible !important;
          }
          /* Prevent page breaks inside critical sections */
          .cv-section, .cv-item, .break-inside-avoid, section, article {
             page-break-inside: avoid !important;
             break-inside: avoid !important;
             break-inside: avoid-page !important;
          }
          /* Remove interactive UI elements during print */
          .no-print, button, .hover-actions {
             display: none !important;
          }
          /* Fix grid/flex layouts breaking in print */
          .grid {
             display: grid !important;
          }
          .flex {
             display: flex !important;
          }
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
    
    // Wait slightly longer to ensure external stylesheets (Google Fonts/Tailwind CDN) load
    setTimeout(() => {
        printWindow.print()
        printWindow.close()
    }, 1000)
}

