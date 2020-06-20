const util = require("util");
const exec = util.promisify(require("child_process").exec);
const alfy = require("alfy");

const bin = (await exec("which vpnutil")).stdout.trim();

const actions = {
  Connected: "stop",
  Disconnected: "start",
};

const strList = (await exec(`${bin} list`)).stdout.trim().split("\n");
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
