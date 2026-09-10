"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __helphubContatoBound?: boolean;
  }
}

export function ContactFormScript() {
  useEffect(() => {
    if (window.__helphubContatoBound) return;
    window.__helphubContatoBound = true;

    function digits(value: string) {
      return String(value || "").replace(/\D/g, "");
    }

    function formatPhone(value: string) {
      const d = digits(value).slice(0, 11);
      if (d.length <= 2) return d.length ? "(" + d : "";
      if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length <= 10) {
        return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
      }
      return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    }

    function show(el: Element | null, on: boolean) {
      if (!el) return;
      if (on) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    }

    function mark(input: Element | null, invalid: boolean) {
      if (!input) return;
      if (invalid) {
        input.setAttribute("aria-invalid", "true");
        input.classList.add("border-ink", "ring-1", "ring-ink");
      } else {
        input.removeAttribute("aria-invalid");
        input.classList.remove("border-ink", "ring-1", "ring-ink");
      }
    }

    function widgetOf(el: Element | null) {
      return el && el.closest("[data-contato-widget]");
    }

    function onInput(event: Event) {
      const t = event.target as HTMLInputElement | null;
      if (!t || !t.getAttribute) return;
      if (t.getAttribute("data-contato-phone") !== null) {
        t.value = formatPhone(t.value);
      }
      const root = widgetOf(t);
      if (!root || !t.name) return;
      const err = root.querySelector('[data-error-for="' + t.name + '"]');
      show(err, false);
      mark(t, false);
      const any = root.querySelector("[data-error-for]:not([hidden])");
      if (!any) show(root.querySelector("[data-contato-banner]"), false);
    }

    function onClick(event: Event) {
      const target = event.target as Element | null;
      if (!target || !target.closest) return;

      const reset = target.closest("[data-contato-reset]");
      if (reset) {
        const resetRoot = widgetOf(reset);
        if (!resetRoot) return;
        show(resetRoot.querySelector("[data-contato-success]"), false);
        show(resetRoot.querySelector("[data-contato-fields]"), true);
        return;
      }

      const btn = target.closest("[data-testid=contato-enviar]");
      if (!btn) return;
      const root = widgetOf(btn);
      if (!root) return;

      const nome = root.querySelector('[name="nome"]') as HTMLInputElement | null;
      const telefone = root.querySelector('[name="telefone"]') as HTMLInputElement | null;
      const mensagem = root.querySelector('[name="mensagem"]') as HTMLTextAreaElement | null;
      const errors = {
        nome: !nome || nome.value.trim().length < 2,
        telefone:
          digits(telefone?.value ?? "").length < 10 ||
          digits(telefone?.value ?? "").length > 11,
        mensagem: !mensagem || mensagem.value.trim().length < 10,
      };

      const hasError = errors.nome || errors.telefone || errors.mensagem;
      show(root.querySelector('[data-error-for="nome"]'), errors.nome);
      show(root.querySelector('[data-error-for="telefone"]'), errors.telefone);
      show(root.querySelector('[data-error-for="mensagem"]'), errors.mensagem);
      mark(nome, errors.nome);
      mark(telefone, errors.telefone);
      mark(mensagem, errors.mensagem);
      show(root.querySelector("[data-contato-banner]"), hasError);

      if (hasError) {
        if (errors.nome && nome) nome.focus();
        else if (errors.telefone && telefone) telefone.focus();
        else if (mensagem) mensagem.focus();
        return;
      }

      if (nome) nome.value = "";
      if (telefone) telefone.value = "";
      if (mensagem) mensagem.value = "";
      show(root.querySelector("[data-contato-fields]"), false);
      show(root.querySelector("[data-contato-success]"), true);
    }

    document.addEventListener("input", onInput);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("input", onInput);
      document.removeEventListener("click", onClick);
      window.__helphubContatoBound = false;
    };
  }, []);

  return null;
}
