const { Readable } = require("stream");
const Jenkins = require("jenkins");

const jenkins = new Jenkins({
  baseUrl: "http://jenkins:123456@localhost:8080",
});

function deployView(req, res) {
  const params = new URLSearchParams(req.url.split("?")[1]);
  const email = params.get("email");
  const buildNum = params.get("buildNumber");

  console.log(email, buildNum);
  const logStream = jenkins.build.logStream("EasyOps", buildNum);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
    Connection: "keep-alive",
  });

  logStream.on("data", (chunk) => {
    res.write(chunk);
  });

  logStream.on("end", () => {
    res.end();
  });

  logStream.on("error", (err) => {
    console.error(err);
    res.end("Error occurred while streaming log.");
  });
}
exports.deployView = deployView;
