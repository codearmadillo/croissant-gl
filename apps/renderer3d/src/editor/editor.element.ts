import './editor.element.css';

export class EditorElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    this.innerHTML = `
      <header>

      </header>
    `;
  }
}
customElements.define('webgl2-editor', EditorElement, {    });
