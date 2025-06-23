// index.mjs
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // For generating pre-signed URLs

// Initialize S3 client
const s3Client = new S3Client({ region: process.env.REGION });

// Environment variables to be set in Lambda configuration
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const REGION = process.env.REGION; // AWS Region (e.g., us-east-1)

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Expected input from updateEvent Lambda or direct API call:
    // { "eventId": "e-123", "eventName": "...", "eventDate": "...", "eventLocation": "...", "attendeeId": "...", "attendeeEmail": "..." }
    const { eventId, eventName, eventDate, eventLocation, attendeeId, attendeeEmail } = event;

    if (!eventId || !eventName || !eventDate || !eventLocation || !attendeeId || !attendeeEmail) {
        console.error('Missing required event/attendee details for ticket generation.');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required event/attendee details.' }),
        };
    }
    if (!S3_BUCKET_NAME || !REGION) {
        console.error('S3_BUCKET_NAME or REGION environment variable is not set.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server configuration error: S3 bucket name or region missing.' }),
        };
    }

    try {
        // 1. Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Define content and styles
        const textSize = 24;
        const smallTextSize = 12;
        const padding = 50;
        const lineHeight = 30;

        // Draw header
        page.drawText('EventSphere - Digital Ticket', {
            x: padding,
            y: page.getHeight() - padding,
            font,
            size: 30,
            color: rgb(0.1, 0.4, 0.8), // A nice blue
        });

        let currentY = page.getHeight() - padding - 60;

        // Draw event details
        page.drawText(`Event: ${eventName}`, { x: padding, y: currentY, font, size: textSize, color: rgb(0, 0, 0) });
        currentY -= lineHeight;
        page.drawText(`Date: ${eventDate}`, { x: padding, y: currentY, font, size: textSize, color: rgb(0, 0, 0) });
        currentY -= lineHeight;
        page.drawText(`Location: ${eventLocation}`, { x: padding, y: currentY, font, size: textSize, color: rgb(0, 0, 0) });
        currentY -= (lineHeight * 2); // More space

        // Draw attendee details
        page.drawText(`Attendee: ${attendeeEmail}`, { x: padding, y: currentY, font, size: textSize, color: rgb(0, 0, 0) });
        currentY -= lineHeight;
        page.drawText(`Attendee ID: ${attendeeId.substring(0, 8)}...`, { x: padding, y: currentY, font, size: smallTextSize, color: rgb(0.3, 0.3, 0.3) });
        currentY -= (lineHeight * 2);

        // Simulate QR Code section (real QR code library would generate a SVG/image here)
        const qrCodeText = `eventsphere|ticket|${eventId}|${attendeeId}`;
        page.drawText('SCAN FOR ENTRY', { x: padding, y: currentY, font, size: textSize, color: rgb(0, 0, 0) });
        currentY -= (lineHeight * 1.5);
        page.drawRectangle({
            x: padding,
            y: currentY - 100,
            width: 150,
            height: 150,
            color: rgb(0.9, 0.9, 0.9), // Light grey box for QR code
            borderColor: rgb(0, 0, 0),
            borderWidth: 1
        });
        page.drawText('QR Code Here (Simulated)', { // Placeholder text
            x: padding + 10, y: currentY - 50, font, size: 10, color: rgb(0, 0, 0)
        });
         page.drawText(qrCodeText.substring(0, 25), { // Show actual QR text below
            x: padding, y: currentY - 120, font, size: 9, color: rgb(0, 0, 0)
        });


        // Finalize PDF
        const pdfBytes = await pdfDoc.save();

        // 2. Upload PDF to S3
        const objectKey = `tickets/${eventId}/${attendeeId}.pdf`; // Path in S3
        const putParams = {
            Bucket: S3_BUCKET_NAME,
            Key: objectKey,
            Body: pdfBytes,
            ContentType: 'application/pdf',
            ACL: 'bucket-owner-full-control' // Ensure bucket owner can access
        };
        const putCommand = new PutObjectCommand(putParams);
        await s3Client.send(putCommand);
        console.log(`Ticket PDF uploaded to s3://${S3_BUCKET_NAME}/${objectKey}`);

        // 3. Generate a pre-signed URL for download
        const getParams = {
            Bucket: S3_BUCKET_NAME,
            Key: objectKey,
            ResponseContentDisposition: `attachment; filename="${eventName.replace(/\s/g, '_')}_Ticket.pdf"`
        };
        const getCommand = new GetObjectCommand(getParams);
        const presignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }); // URL valid for 1 hour
        console.log('Pre-signed URL generated.');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Ticket generated and uploaded successfully!',
                ticketUrl: presignedUrl,
                s3Path: `s3://${S3_BUCKET_NAME}/${objectKey}`
            }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

    } catch (error) {
        console.error('Error in generateTicketPDF Lambda:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to generate or upload ticket PDF.', error: error.message }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }
};
