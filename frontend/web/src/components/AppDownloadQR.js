"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function AppDownloadQR() {
  const apkUrl = "https://expo.dev/accounts/danieltfg/projects/mobile/builds/81300386-1cc8-4650-94ae-30b910a98de1";

  return (
    <div className="app-qr-card">
      <h3>Descarga la app móvil</h3>

      <QRCodeCanvas
        value={apkUrl}
        size={150}
        includeMargin={true}
      />

      <p>Escanea el QR para descargar ReservIt en Android</p>

      <a href={apkUrl} target="_blank" rel="noopener noreferrer">
        Descargar APK
      </a>
    </div>
  );
}