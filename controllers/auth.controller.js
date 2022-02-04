const User = require('../model/auth.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const { errorHandler } = require('../helpers/dbErrorHandling');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'Hrithik Rastogi',
  key: process.env.MAILGUN_API_KEY,
  public_key: process.env.MAILGUN_PUB_KEY,
});

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  console.log('inside custom validation');
  console.log(req.body);
  //custom validation
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    console.log('inside empty error');
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          message: 'Email is taken',
        });
      }
    });

    //GENERATE TOKEN
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '5m',
      }
    );
    console.log(token);

    // Email Data
    const emailData = {
      from: 'Brightigo <mailgun@brightigo.xyz>',
      to: email,
      subject: 'Brightigo Account activation link',
      text: 'Testing some Mailgun awesomness!',
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
       <html
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        style="font-family: 'comic sans ms', 'marker felt-thin', arial, sans-serif"
       >
        <head>
          <meta charset="UTF-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta content="telephone=no" name="format-detection" />
          <title>New message</title>
          <!--[if (mso 16)]>
            <style type="text/css">
              a {
                text-decoration: none;
              }
            </style>
          <![endif]-->
          <!--[if gte mso 9
            ]><style>
              sup {
                font-size: 100% !important;
              }
            </style><!
          [endif]-->
          <!--[if gte mso 9]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          <![endif]-->
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
            .es-button {
              mso-style-priority: 100 !important;
              text-decoration: none !important;
            }
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
            }
            .es-desk-hidden {
              display: none;
              float: left;
              overflow: hidden;
              width: 0;
              max-height: 0;
              line-height: 0;
              mso-hide: all;
            }
            [data-ogsb] .es-button {
              border-width: 0 !important;
              padding: 10px 20px 10px 20px !important;
            }
            @media only screen and (max-width: 600px) {
              p,
              ul li,
              ol li,
              a {
                line-height: 150% !important;
              }
              h1,
              h2,
              h3,
              h1 a,
              h2 a,
              h3 a {
                line-height: 120%;
              }
              h1 {
                font-size: 30px !important;
                text-align: left;
              }
              h2 {
                font-size: 24px !important;
                text-align: left;
              }
              h3 {
                font-size: 20px !important;
                text-align: left;
              }
              .es-header-body h1 a,
              .es-content-body h1 a,
              .es-footer-body h1 a {
                font-size: 30px !important;
                text-align: left;
              }
              .es-header-body h2 a,
              .es-content-body h2 a,
              .es-footer-body h2 a {
                font-size: 24px !important;
                text-align: left;
              }
              .es-header-body h3 a,
              .es-content-body h3 a,
              .es-footer-body h3 a {
                font-size: 20px !important;
                text-align: left;
              }
              .es-menu td a {
                font-size: 14px !important;
              }
              .es-header-body p,
              .es-header-body ul li,
              .es-header-body ol li,
              .es-header-body a {
                font-size: 14px !important;
              }
              .es-content-body p,
              .es-content-body ul li,
              .es-content-body ol li,
              .es-content-body a {
                font-size: 14px !important;
              }
              .es-footer-body p,
              .es-footer-body ul li,
              .es-footer-body ol li,
              .es-footer-body a {
                font-size: 14px !important;
              }
              .es-infoblock p,
              .es-infoblock ul li,
              .es-infoblock ol li,
              .es-infoblock a {
                font-size: 12px !important;
              }
              *[class='gmail-fix'] {
                display: none !important;
              }
              .es-m-txt-c,
              .es-m-txt-c h1,
              .es-m-txt-c h2,
              .es-m-txt-c h3 {
                text-align: center !important;
              }
              .es-m-txt-r,
              .es-m-txt-r h1,
              .es-m-txt-r h2,
              .es-m-txt-r h3 {
                text-align: right !important;
              }
              .es-m-txt-l,
              .es-m-txt-l h1,
              .es-m-txt-l h2,
              .es-m-txt-l h3 {
                text-align: left !important;
              }
              .es-m-txt-r img,
              .es-m-txt-c img,
              .es-m-txt-l img {
                display: inline !important;
              }
              .es-button-border {
                display: inline-block !important;
              }
              a.es-button,
              button.es-button {
                font-size: 18px !important;
                display: inline-block !important;
              }
              .es-adaptive table,
              .es-left,
              .es-right {
                width: 100% !important;
              }
              .es-content table,
              .es-header table,
              .es-footer table,
              .es-content,
              .es-footer,
              .es-header {
                width: 100% !important;
                max-width: 600px !important;
              }
              .es-adapt-td {
                display: block !important;
                width: 100% !important;
              }
              .adapt-img {
                width: 100% !important;
                height: auto !important;
              }
              .es-m-p0 {
                padding: 0px !important;
              }
              .es-m-p0r {
                padding-right: 0px !important;
              }
              .es-m-p0l {
                padding-left: 0px !important;
              }
              .es-m-p0t {
                padding-top: 0px !important;
              }
              .es-m-p0b {
                padding-bottom: 0 !important;
              }
              .es-m-p20b {
                padding-bottom: 20px !important;
              }
              .es-mobile-hidden,
              .es-hidden {
                display: none !important;
              }
              tr.es-desk-hidden,
              td.es-desk-hidden,
              table.es-desk-hidden {
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                line-height: inherit !important;
              }
              tr.es-desk-hidden {
                display: table-row !important;
              }
              table.es-desk-hidden {
                display: table !important;
              }
              td.es-desk-menu-hidden {
                display: table-cell !important;
              }
              .es-menu td {
                width: 1% !important;
              }
              table.es-table-not-adapt,
              .esd-block-html table {
                width: auto !important;
              }
              table.es-social {
                display: inline-block !important;
              }
              table.es-social td {
                display: inline-block !important;
              }
            }
          </style>
        </head>
        <body
          style="
            width: 100%;
            font-family: 'comic sans ms', 'marker felt-thin', arial, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            padding: 0;
            margin: 0;
          "
        >
          <div class="es-wrapper-color" style="background-color: #f6f6f6">
            <!--[if gte mso 9]>
              <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f6f6f6"></v:fill>
              </v:background>
            <![endif]-->
            <table
              class="es-wrapper"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                background-repeat: repeat;
                background-position: center top;
              "
            >
              <tr>
                <td valign="top" style="padding: 0; margin: 0">
                  <table
                    class="es-header"
                    cellspacing="0"
                    cellpadding="0"
                    align="center"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      table-layout: fixed !important;
                      width: 100%;
                      background-color: transparent;
                      background-repeat: repeat;
                      background-position: center top;
                    "
                  >
                    <tr>
                      <td align="center" style="padding: 0; margin: 0">
                        <table
                          class="es-header-body"
                          cellspacing="0"
                          cellpadding="0"
                          bgcolor="#ffffff"
                          align="center"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            background-color: #ffffff;
                            width: 600px;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    valign="top"
                                    align="center"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          align="left"
                                          style="padding: 0; margin: 0"
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              font-family: 'comic sans ms',
                                                'marker felt-thin', arial, sans-serif;
                                              line-height: 27px;
                                              color: #44337a;
                                              font-size: 18px;
                                            "
                                          >
                                            Brightigo Product School
                                          </p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <table
                    class="es-content"
                    cellspacing="0"
                    cellpadding="0"
                    align="center"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      table-layout: fixed !important;
                      width: 100%;
                    "
                  >
                    <tr>
                      <td align="center" style="padding: 0; margin: 0">
                        <table
                          class="es-content-body"
                          cellspacing="0"
                          cellpadding="0"
                          bgcolor="#ffffff"
                          align="center"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            background-color: #ffffff;
                            width: 600px;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    valign="top"
                                    align="center"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          align="left"
                                          style="padding: 5px; margin: 0"
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              font-family: 'comic sans ms',
                                                'marker felt-thin', arial, sans-serif;
                                              line-height: 39px;
                                              color: #333333;
                                              font-size: 26px;
                                            "
                                          >
                                            Activate your Brightigo Account
                                          </p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    valign="top"
                                    align="center"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          align="left"
                                          style="padding: 0; margin: 0"
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              -webkit-text-size-adjust: none;
                                              -ms-text-size-adjust: none;
                                              mso-line-height-rule: exactly;
                                              font-family: 'comic sans ms',
                                                'marker felt-thin', arial, sans-serif;
                                              line-height: 24px;
                                              color: #333333;
                                              font-size: 16px;
                                            "
                                          >
                                            Thank you for registering to Brightigo.
                                            Click on the button below this will
                                            activate your account.<br />
                                          </p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="left"
                              style="
                                padding: 0;
                                margin: 0;
                                padding-top: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    valign="top"
                                    align="center"
                                    style="padding: 0; margin: 0; width: 560px"
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          align="left"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-bottom: 15px;
                                          "
                                        >
                                          <span
                                            class="es-button-border"
                                            style="
                                              border-style: solid;
                                              border-color: #2cb543;
                                              background: #44337a;
                                              border-width: 0px;
                                              display: inline-block;
                                              border-radius: 0px;
                                              width: auto;
                                            "
                                            ><a
                                              href="${process.env.CLIENT_URL}/users/activate/${token}"
                                              class="es-button"
                                              target="_blank"
                                              style="
                                                mso-style-priority: 100 !important;
                                                text-decoration: none;
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                color: #ffffff;
                                                font-size: 18px;
                                                border-style: solid;
                                                border-color: #44337a;
                                                border-width: 10px 20px 10px 20px;
                                                display: inline-block;
                                                background: #44337a;
                                                border-radius: 0px;
                                                font-family: arial, 'helvetica neue',
                                                  helvetica, sans-serif;
                                                font-weight: normal;
                                                font-style: normal;
                                                line-height: 22px;
                                                width: auto;
                                                text-align: center;
                                              "
                                              >Activate Account</a
                                            ></span
                                          >
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
      `,
    };
    // send the email data
    mg.messages
      .create('brightigo.xyz', emailData)
      .then(() => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        console.log('Mailgun error ', err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      });
  }
};

//activation and save to database
exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    //verify the token is valid or not or expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again',
        });
      } else {
        //if valid save to database
        // get name email password from token
        const { name, email, password } = jwt.decode(token);

        console.log(email);
        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              user: user,
              message: 'Signup success',
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: 'Error happening please try again',
    });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: 'Email does not exist. Please register',
          at: 'email',
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Wrong Password. Try Again',
          at: 'password',
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d', // token valud for 7 days set [] remember me and set it for 30 days
        }
      );
      const { _id, profilePicture, phoneNumber, name, test, email, role } =
        user;

      return res.json({
        token,
        user: {
          _id,
          profilePicture,
          phoneNumber,
          test,
          name,
          email,
          role,
        },
      });
    });
  }
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // find if the user exists
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: 'Email does not exist',
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: '10m',
          }
        );

        const emailData = {
          from: 'Brightigo <mailgun@brightigo.xyz>',
          to: email,
          subject: 'Brightigo Password Reset',
          html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New message</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">#outlook a {	padding:0;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}[data-ogsb] .es-button {	border-width:0!important;	padding:10px 20px 10px 20px!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }</style></head>
<body style="width:100%;font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div class="es-wrapper-color" style="background-color:#F6F6F6"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f6f6f6"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"><tr><td valign="top" style="padding:0;Margin:0"><table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif;line-height:27px;color:#44337a;font-size:18px">Brightigo Product School</p>
</td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:5px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif;line-height:39px;color:#333333;font-size:26px">Brightigo Password Reset<br></p>
</td></tr></table></td></tr></table></td>
</tr><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif;line-height:24px;color:#333333;font-size:16px">Someone requested a password reset for your account. If this was not you, please disregard this email. If you'd like to continue click the&nbsp; Button below. <br></p></td>
</tr></table></td></tr><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;padding-left:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'comic sans ms', 'marker felt-thin', arial, sans-serif;line-height:27px;color:#e06666;font-size:18px">Valid for 20 Minutes</p></td></tr></table></td></tr></table></td>
</tr><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;padding-bottom:15px"><span class="es-button-border" style="border-style:solid;border-color:#2cb543;background:#44337a;border-width:0px;display:inline-block;border-radius:0px;width:auto"><a href=${process.env.CLIENT_URL}/users/password/reset/${token} class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#44337a;border-width:10px 20px 10px 20px;display:inline-block;background:#44337a;border-radius:0px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center">Reset Password</a></span></td>
</tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
`,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log('RESET PASSWORD LINK ERROR', err);
              return res.status(400).json({
                error:
                  'Database connection error on user password forgot request',
              });
            } else {
              mg.messages
                .create('brightigo.xyz', emailData)
                .then(() => {
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  console.log(newPassword);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: 'Expired link. Try again',
            });
          }

          User.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: 'Something went wrong. Try later',
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: '',
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: 'Error resetting user password',
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

// Google Login
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.googleController = (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  client
    .verifyIdToken({
      idToken,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    })
    .then((response) => {
      const { email_verified, name, email, picture } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            //find if the email already exists
            console.log('user exists 😊');
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            });
            const { _id, email, name, profilePicture, role } = user;
            return res.json({
              //send response to client side (token and user info)
              token,
              user: { _id, email, name, profilePicture, role },
            });
          } else {
            console.log('user does not exits 🤭');
            //if user not exists we will save in database and generate pasword for it
            let password = email + process.env.JWT_SECRET;
            const profilePicture = picture;
            user = new User({ name, email, password, profilePicture }); //create new user object with google data
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE - ', err);
                return res.status(400).json({
                  error: 'User signup failed with google',
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name, profilePicture, role } = data;
              return res.json({
                token,
                user: { _id, email, name, profilePicture, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again',
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
