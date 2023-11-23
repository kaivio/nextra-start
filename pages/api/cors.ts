import stream from "stream";
import { promisify } from "util";
import got from "got";
import type { VercelRequest, VercelResponse } from '@vercel/node';


const pipeline = promisify(stream.pipeline);

export default  function handler(req: VercelRequest, res: VercelResponse) {
  setCORS(res)

  let p = req.url.indexOf("url=");
  let dest = req.url.substring(p + 4);
  dest = decodeURIComponent(dest);
  if (!/https?:\/\/.*/.test(dest)) {
    dest = "http://" + dest;
  }
  let headers = req.headers;
  try {
    headers.host = new URL(dest).host;
  } catch (e) {
    res.statusCode = 400;
    res.json({
      message: "Parameter error",
      error: e + ''
    });
    return;
  }
  let option = {
    allowGetBody: true,
    throwHttpErrors: false,
    method: req.method,
    headers: headers,
    body: req
  };
  
  if(['HEAD', 'OPTIONS'].includes(req.method)){
    delete option.body
  }

  (async () => {
    try {
      await pipeline(got.stream(dest, option), res);
    } catch (err) {
      console.log("Error at await pipeline", err + '');
      res.json(err + "");
    }
  })();
};

function setCORS(res){
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader('access-control-allow-methods', "*");
  res.setHeader('Access-Control-Allow-Headers', "*");
  res.setHeader('Access-Control-Expose-Headerss', "*");
  // res.setHeader('Access-Control-Allow-Credentials', "true");
}

export const config = {
  api: {
    bodyParser: false
  }
};

