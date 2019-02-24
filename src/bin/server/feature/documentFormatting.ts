import * as LSP from "vscode-languageserver-protocol";
import * as command from "../command";
import Session from "../session";
import * as support from "../support";

export default function(session: Session): LSP.RequestHandler<LSP.DocumentFormattingParams, LSP.TextEdit[], never> {
  return support.cancellableHandler(session, async (event, _token) => {
    const result = await command.getTextDocument(session, event.textDocument);
    if (null == result) return [];
    const document = LSP.TextDocument.create(
      event.textDocument.uri,
      result.languageId,
      result.version,
      result.getText(),
    );
    let otxt: null | string = null;
    if (document.languageId === "ocaml") {
      // FIXME: This needs a better name.
      const tool = session.settings.reason.format.ocamltool;
      if (tool === "ocamlformat") otxt = await command.getFormatted.ocamlformat(session, document);
      else if (tool === "ocp-indent") otxt = await command.getFormatted.ocpIndent(session, document);
    }
    if (document.languageId === "reason") otxt = await command.getFormatted.refmt(session, document);
    if (null == otxt || "" === otxt) return [];
    const edits: LSP.TextEdit[] = [];
    edits.push(
      LSP.TextEdit.replace(
        LSP.Range.create(document.positionAt(0), document.positionAt(result.getText().length)),
        otxt,
      ),
    );
    return edits;
  });
}
