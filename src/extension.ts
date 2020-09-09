"use strict";

import * as vscode from "vscode";
import * as commands from "./commands/generate";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.greymatter.generate",
      commands.Generate(context)
    )
  );
}

export function deactivate() {}
