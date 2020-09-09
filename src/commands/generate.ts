"use strict";

import process = require("child_process");
import vscode = require("vscode");
import { RSA_PKCS1_OAEP_PADDING } from "constants";

// Generate returns a command that generates file system entries using greymatter. If
// args contains a `fsPath` property the entries will be rooted at that location;
// otherwise the entries will be rooted at the root of the workspace.
export function Generate(
  context: vscode.ExtensionContext
): (...args: any[]) => any {
  return async function (args: any) {
    const destination = args ? args.fsPath : vscode.workspace.rootPath;
    const sources = <string[]>(
      JSON.parse(context.workspaceState.get("greymatter.sources") || "[]")
    );
    const source = (await showQuickInputBox(sources)) || "";
    const generate = process.spawn("greymatter", [
      "generate",
      source,
      destination
    ]);

    generate.stdout.on("data", async (data: any) => {
      let value = await vscode.window.showInputBox({
        prompt: data.toString().replace(/:$/, "")
      });
      generate.stdin.write(`${value}\n`);
    });

    generate.on("exit", (code) => {
      if (code === 0) {
        const sources = <string[]>(
          JSON.parse(
            context.workspaceState.get("greymatter.sources") || "[]"
          ).concat(source)
        );
        context.workspaceState.update(
          "greymatter.sources",
          JSON.stringify([...new Set(sources)])
        );
      }
    });
  };
}

// showQuickInputBox displays a QuickPick that allows for any text.
function showQuickInputBox(values: string[]): Promise<string | undefined> {
  return new Promise<string>((resolve) => {
    const i = values.map((label) => ({ label }));
    const p = vscode.window.createQuickPick();
    p.items = i;
    p.onDidAccept(() => {
      p.hide();
      resolve(p.activeItems[0].label);
    });
    p.onDidChangeValue((v) => {
      if (values.indexOf(v) < 0) {
        p.items = i.concat([{ label: v }]);
      }
    });
    p.show();
  });
}
