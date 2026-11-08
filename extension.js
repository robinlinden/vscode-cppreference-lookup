import * as vscode from 'vscode';

export function activate(context) {
    const disposable = vscode.commands.registerCommand(
        'vscode-cppreference-lookup.lookupSymbol',
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showInformationMessage(
                    'Open a source file to look up a C++ symbol.'
                );

                return;
            }

            const document = editor.document;
            const selection = editor.selection;

            // Prefer selected text; otherwise use the word under the cursor.
            let symbol = document.getText(selection).trim();

            if (!symbol) {
                const wordRange = document.getWordRangeAtPosition(
                    selection.active,
                    /[A-Za-z_~][A-Za-z0-9_~:]*/
                );

                if (wordRange) {
                    symbol = document.getText(wordRange);
                }
            }

            if (!symbol) {
                vscode.window.showInformationMessage(
                    'No symbol found under the cursor.'
                );

                return;
            }

            const url = new URL('https://en.cppreference.com/w/index.php');

            url.searchParams.set('title', 'Special:Search');
            url.searchParams.set('search', symbol);

            // TODO(robinlinden): Option to not open the result in VS Code.
            // await vscode.env.openExternal(
            //     vscode.Uri.parse(url.toString())
            // );

            await vscode.commands.executeCommand(
                'simpleBrowser.api.open',
                vscode.Uri.parse(url.toString()),
                {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true
                }
            );
        }
    );

    context.subscriptions.push(disposable);
}
