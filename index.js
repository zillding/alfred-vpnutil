const util = require("util");
const exec = util.promisify(require("child_process").exec);
const alfy = require("alfy");

const bin = "./vpnutil";
const statuses = [
  "Connected",
  "Disconnected",
  "Connecting",
  "Disconnecting",
  "Invalid",
  "Unknown",
];

function getAction(status) {
  switch (status) {
    case statuses[0]:
      return "stop";
    case statuses[1]:
      return "start";
    default:
      return "";
  }
}

function getIcon(status) {
  switch (status) {
    case statuses[0]:
      return "icon-connected.png";
    case statuses[1]:
      return "icon-disconnected.png";
    default:
      return "icon.png";
  }
}

let strList = alfy.cache.get("data");
if (!strList) {
  const { stdout, stderr } = await exec(`${bin} list`);

  if (stderr.trim()) {
    return alfy.output([
      {
        title: "Oops, something is wrong.",
        subtitle: stderr.slice(stderr.trim().indexOf("]") + 1),
      },
    ]);
  }

  strList = stdout.trim().split("\n");
  alfy.cache.set("data", strList, { maxAge: 5000 });
}

const list = statuses
  .map((status) =>
    strList
      .filter((s) => s.endsWith(status))
      .map((s) => {
        const name = s.slice(0, s.length - status.length - 1);
        const action = getAction(status);
        return {
          s,
          name,
          status,
          cmd: action && `${bin} ${action} '${name}'`,
        };
      })
  )
  .flat();

const items = alfy.inputMatches(list, "s").map((o) => ({
  title: o.name,
  subtitle: o.status,
  arg: o.cmd,
  icon: { path: getIcon(o.status) },
}));

alfy.output(items);
