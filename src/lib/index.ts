import * as deepmerge from "deepmerge";
import * as merlin from "./merlin";
import * as remote from "./remote";
import * as types from "./types";

export interface ISettings {
  reason: {
    codelens: {
      enabled: boolean;
      unicode: boolean;
    };
    debounce: {
      linter: number;
    };
    diagnostics: {
      merlinPerfLogging: boolean;
      tools: Array<"merlin" | "bsb" | "esy">;
    };
    path: {
      bsb: string;
      env: string;
      esy: string;
      ocamlfind: string;
      ocamlformat: string;
      ocamlmerlin: string;
      ocpindent: string;
      opam: string;
      rebuild: string;
      refmt: string;
      refmterr: string;
      rtop: string;
    };
    format: {
      // FIXME: This needs a better name.
      ocamltool: "ocamlformat" | "ocp-indent";
      width: number | null;
    };
    server: {
      languages: Array<"ocaml" | "reason">;
    };
  };
}
export namespace ISettings {
  export const defaults: ISettings = {
    reason: {
      codelens: {
        enabled: true,
        unicode: true,
      },
      debounce: {
        linter: 500,
      },
      diagnostics: {
        merlinPerfLogging: false,
        tools: ["merlin"],
      },
      format: {
        ocamltool: "ocamlformat",
        width: null,
      },
      path: {
        bsb: "./node_modules/bs-platform/lib/bsb.exe",
        env: "env",
        esy: "esy",
        ocamlfind: "ocamlfind",
        ocamlformat: "ocamlformat",
        ocamlmerlin: "ocamlmerlin",
        ocpindent: "ocp-indent",
        opam: "opam",
        rebuild: "rebuild",
        refmt: "refmt",
        refmterr: "refmterr",
        rtop: "rtop",
      },
      server: {
        languages: ["ocaml", "reason"],
      },
    },
  };

  export function withDefaults(overrides: typeof defaults.reason | undefined | null): typeof defaults.reason {
    return deepmerge(ISettings.defaults.reason, overrides || {}, {
      arrayMerge<A>(_: A[], source: A[]): A[] {
        return source; // overwites arrays (with overrides) instead of merging
      },
    });
  }
}

export { merlin, remote, types };
