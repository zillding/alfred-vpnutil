const util = require("util");
const exec = util.promisify(require("child_process").exec);
const alfy = require("alfy");

const bin = "./vpnutil";

const m = {
  Connected: ["stop", "icon-connected.png"],
  Disconnected: ["start", "icon-disconnected.png"],
};

let strList = alfy.cache.get("data");
if (!strList) {
  strList = (await exec(`${bin} list`)).stdout.trim().split("\n");
  alfy.cache.set("data", strList, { maxAge: 5000 });
}

const list = ["Connected", "Disconnected"]
  .map((status) =>
    strList
      .filter((s) => s.endsWith(status))
      .map((s) => {
        const name = s.slice(0, s.length - status.length - 1);
        return {
          s,
          name,
          status,
          cmd: `${bin} ${m[status][0]} '${name}'`,
        };
      })
  )
  .flat();

const items = alfy.inputMatches(list, "s").map((o) => ({
  title: o.name,
  subtitle: o.status,
  arg: o.cmd,
  icon: { path: m[o.status][1] },
}));

alfy.output(items);
