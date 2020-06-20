const util = require("util");
const exec = util.promisify(require("child_process").exec);
const alfy = require("alfy");

const bin = "./vpnutil";

const actions = {
  Connected: "stop",
  Disconnected: "start",
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
          cmd: `${bin} ${actions[status]} '${name}'`,
        };
      })
  )
  .flat();

const items = alfy.inputMatches(list, "s").map((o) => ({
  title: o.name,
  subtitle: o.status,
  arg: o.cmd,
}));

alfy.output(items);
