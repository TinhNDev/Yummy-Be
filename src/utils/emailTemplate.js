function forgotPasswordEmailTemplate(email, resetLink) {
  return {
    from: `${process.env.EMAIL}`,
    to: email,
    subject: 'Yêu Cầu Đặt Lại Mật Khẩu - Yummy',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đặt Lại Mật Khẩu - Yummy</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <!-- Header with Logo -->
        <tr>
          <td align="center" style="padding: 30px 0; background-color: #F44336; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <img src="https://thumbs.dreamstime.com/z/food-logo-smile-label-company-grocery-store-friendly-vector-illustration-smiling-mouth-symbol-135565322.jpg" alt="Yummy Logo" style="width: 120px; height: auto;">
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 20px; text-align: center;">
                  <h1 style="margin: 0; color: #F44336; font-size: 28px; font-weight: 700;">Đặt Lại Mật Khẩu</h1>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 25px; text-align: center; line-height: 1.6;">
                  <p style="margin: 0; font-size: 16px;">Chúng tôi nhận thấy bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                  <p style="margin: 15px 0 0; font-size: 16px;">Vui lòng nhấp vào nút bên dưới để tiếp tục quá trình đặt lại mật khẩu:</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="border-radius: 50px;" bgcolor="#F44336">
                        <a href="${resetLink}" target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 50px; padding: 12px 30px; border: 1px solid #F44336; display: inline-block;">Đặt Lại Mật Khẩu</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding-bottom: 20px;">
                  <p style="margin: 0; font-size: 16px; font-weight: bold; color: #555555;">Liên kết này chỉ có hiệu lực trong 30 phút.</p>
                  <p style="margin: 10px 0 0; font-size: 14px; color: #777777;">Vì lý do bảo mật, vui lòng không chia sẻ liên kết này với người khác.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px; background-color: #f7f7f7; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #777777;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với hỗ trợ của chúng tôi.</p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #777777;">© 2025 Yummy. Tất cả các quyền được bảo lưu.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  };
}

function verificationEmailTemplate(email, verificationLink) {
  return {
    from: `${process.env.EMAIL}`,
    to: email,
    subject: 'Xác Minh Địa Chỉ Email - Yummy',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác Minh Email - Yummy</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <!-- Header with Logo -->
        <tr>
          <td align="center" style="padding: 30px 0; background-color: #FF6B35; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <img src="https://thumbs.dreamstime.com/z/food-logo-smile-label-company-grocery-store-friendly-vector-illustration-smiling-mouth-symbol-135565322.jpg" alt="Yummy Logo" style="width: 120px; height: auto;">
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 20px; text-align: center;">
                  <h1 style="margin: 0; color: #FF6B35; font-size: 28px; font-weight: 700;">Chào Mừng Đến Với Yummy!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 25px; text-align: center; line-height: 1.6;">
                  <p style="margin: 0; font-size: 16px;">Cảm ơn bạn đã đăng ký tài khoản với chúng tôi.</p>
                  <p style="margin: 15px 0 0; font-size: 16px;">Vui lòng xác minh địa chỉ email của bạn để bắt đầu trải nghiệm ẩm thực tuyệt vời!</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="border-radius: 50px;" bgcolor="#FF6B35">
                        <a href="${verificationLink}" target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 50px; padding: 12px 30px; border: 1px solid #FF6B35; display: inline-block;">Xác Minh Email Ngay</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding-bottom: 20px;">
                  <p style="margin: 0; font-size: 16px; font-weight: bold; color: #555555;">Hãy tận hưởng những món ăn tuyệt vời từ chúng tôi!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px; background-color: #f7f7f7; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #777777;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <p style="margin: 10px 0 0; font-size: 14px; color: #777777;">© 2025 Yummy. Tất cả các quyền được bảo lưu.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  };
}

module.exports = { verificationEmailTemplate, forgotPasswordEmailTemplate };
