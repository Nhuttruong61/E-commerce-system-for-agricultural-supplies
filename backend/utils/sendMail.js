const nodemailer = require("nodemailer");
const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
const sendMailCreateOrder = async ({ order }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  let listItem = "";

  order?.cart.map((el) => {
    listItem += `<div style="padding: 10px 0">
    Bạn đã mua sản phẩm <b>${el.name}</b> <br/>
    Số lượng <b>${el.quantity}</b> <br/>
    Giá <b>${el.price ? el.price : 0}</b>
    <div >Bên dưới là hình ảnh của sản phẩm</div>
    <img src="${el.image}" alt="" style="max-height: 200px;" />
  </div>`;
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: order.user.email,
    subject: "Thông tin đơn hàng",
    html: `<div><b style="font-size: 40px; font-weight: 600;">Bạn đã đặt hàng thành công tại shop</b>${listItem}
    <br/>
    <p style="font-size: 16px; ">Trạng thái: ${order.paymentInfo.status}</p>
    <p style="font-size: 20px; font-weight: 600;">Tổng giá ${order.totalPrice}</p>
    </div> `,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = { sendMail, sendMailCreateOrder };
