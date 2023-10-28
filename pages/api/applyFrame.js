// pages/api/applyFrame.js

import sharp from 'sharp';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const base64Data = req.body.file.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const cercevePath = './public/cerceve.png';

    const frame = sharp(cercevePath);
    const { width: frameWidth, height: frameHeight } = await frame.metadata();

    const desiredSize = Math.min(frameWidth, frameHeight) * 0.6;  // Örnek olarak çerçevenin %80'i alındı

    const userImage = sharp(imageBuffer).resize(desiredSize, desiredSize, {
        fit: 'cover',
        position: 'center'
    });

    const mask = Buffer.from(
        `<svg width="${desiredSize}" height="${desiredSize}">
            <circle cx="${desiredSize / 2}" cy="${desiredSize / 2}" r="${desiredSize / 2}" />
        </svg>`
    );

    const roundedUserImageBuffer = await userImage.composite([{
        input: mask,
        blend: 'dest-in'
    }]).png().toBuffer();

    const offsetX = (frameWidth - desiredSize) / 2;
    const offsetY = (frameHeight - desiredSize) / 2;

    const processedImage = await frame
        .composite([{
            input: roundedUserImageBuffer,
            top: Math.round(offsetY),
            left: Math.round(offsetX)
        }])
        .png()
        .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.send(processedImage);
};
