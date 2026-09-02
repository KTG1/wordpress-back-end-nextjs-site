(() => {
  function updateAddButton(name) {
    const container = document.querySelector(`[data-fsc-repeater="${name}"]`);
    const button = document.querySelector(`[data-fsc-add="${name}"]`);

    if (!container || !button) {
      return;
    }

    const limit = Number(container.dataset.fscLimit || 12);
    const count = container.querySelectorAll("[data-fsc-row]").length;
    button.disabled = count >= limit;
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const addButton = target.closest("[data-fsc-add]");

    if (addButton) {
      const name = addButton.dataset.fscAdd;
      const container = document.querySelector(`[data-fsc-repeater="${name}"]`);
      const template = document.querySelector(`#fsc-template-${name}`);

      if (!name || !container || !(template instanceof HTMLTemplateElement)) {
        return;
      }

      const limit = Number(container.dataset.fscLimit || 12);
      const rows = [...container.querySelectorAll("[data-fsc-row]")];

      if (rows.length >= limit) {
        return;
      }

      const indexes = rows.map((row) => Number(row.dataset.fscIndex || 0));
      const index = indexes.length ? Math.max(...indexes) + 1 : 0;
      const markup = template.innerHTML.replaceAll("__INDEX__", String(index));
      container.insertAdjacentHTML("beforeend", markup);
      updateAddButton(name);
      container.querySelector(`[data-fsc-index="${index}"] input`)?.focus();
      return;
    }

    const removeButton = target.closest("[data-fsc-remove]");

    if (removeButton) {
      const row = removeButton.closest("[data-fsc-row]");
      const container = removeButton.closest("[data-fsc-repeater]");
      const name = container?.dataset.fscRepeater;

      row?.remove();

      if (name) {
        updateAddButton(name);
      }
    }
  });

  document.querySelectorAll("[data-fsc-repeater]").forEach((container) => {
    if (container.dataset.fscRepeater) {
      updateAddButton(container.dataset.fscRepeater);
    }
  });
})();
