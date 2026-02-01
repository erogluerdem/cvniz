const getWelcomeTemplate = (userName) => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 10px; margin: 5px 0; background: white; border-left: 4px solid #667eea; padding-left: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Hoş Geldiniz, ${userName}!</h1>
        </div>
        <div class="content">
            <p>CVniz'de hesabınız başarıyla oluşturuldu. Profesyonel CV'nizi oluşturmaya başlamaya hazır mısınız?</p>
            
            <h3>CVniz ile yapabilecekleriniz:</h3>
            <ul class="feature-list">
                <li>✨ Profesyonel CV şablonları</li>
                <li>🤖 AI destekli CV önerileri</li>
                <li>📊 Görüntüleme istatistikleri</li>
                <li>💼 İşe alım yöneticileriyle bağlantı</li>
                <li>📱 Mobil CV görüntüleme</li>
            </ul>
            
            <a href="${process.env.VITE_APP_URL}/dashboard" class="button">Hemen Başla</a>
            
            <p style="margin-top: 30px;">Sorularınız mı var? <a href="${process.env.VITE_APP_URL}/support">Destek ekibimize</a> başvurun.</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 CVniz. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
`;

const getResetPasswordTemplate = (resetLink, userName) => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Şifre Sıfırla</h1>
        </div>
        <div class="content">
            <p>Merhaba ${userName},</p>
            <p>CVniz hesabınızın şifresini sıfırlamak için bir talep aldık.</p>
            
            <a href="${resetLink}" class="button">Şifremi Sıfırla</a>
            
            <div class="warning">
                <strong>⚠️ Güvenlik Uyarısı:</strong> Bu linkin geçerlilik süresi 24 saattir. Sizin tarafından yapılmadıysa, bu e-postayı görmezden gelin.
            </div>
            
            <p>Link çalışmazsa, şu URL'yi tarayıcınıza kopyalayın:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;"><small>${resetLink}</small></p>
        </div>
        <div class="footer">
            <p>&copy; 2026 CVniz. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
`;

const getVerificationTemplate = (verificationLink) => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✉️ E-postanızı Doğrulayın</h1>
        </div>
        <div class="content">
            <p>Hesabınızı etkinleştirmek için e-postanızı doğrulayın.</p>
            
            <a href="${verificationLink}" class="button">E-postayı Doğrula</a>
            
            <p>Buton çalışmazsa, şu URL'yi tarayıcınıza kopyalayın:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;"><small>${verificationLink}</small></p>
        </div>
        <div class="footer">
            <p>&copy; 2026 CVniz. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
`;

const getCVViewNotificationTemplate = (cvTitle, viewerName, timestamp) => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .notification { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👁️ CV'niz Görüntülendi!</h1>
        </div>
        <div class="content">
            <div class="notification">
                <p><strong>"${cvTitle}"</strong> CV'niz tarafından görüntülendi: <strong>${viewerName || 'Anonim'}</strong></p>
                <p style="color: #666; font-size: 12px;">Tarih: ${new Date(timestamp).toLocaleDateString('tr-TR')}</p>
            </div>
            
            <p>CV'niz başarıyla dikkat çekiyor! İstatistiklerinizi görüntülemek için aşağıdaki düğmeye tıklayın.</p>
            
            <a href="${process.env.VITE_APP_URL}/analytics" class="button">İstatistikleri Görüntüle</a>
        </div>
        <div class="footer">
            <p>&copy; 2026 CVniz. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = {
    getWelcomeTemplate,
    getResetPasswordTemplate,
    getVerificationTemplate,
    getCVViewNotificationTemplate
};
