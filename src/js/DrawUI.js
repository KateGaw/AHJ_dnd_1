/* eslint-disable class-methods-use-this */
export default class DrawUI {
  constructor() {
    this.toDo = document.querySelector('#todo .taskItems');
    this.inProgress = document.querySelector('#in-progress .taskItems');
    this.done = document.querySelector('#done .taskItems');
  }

  newItem(parent, value) {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `${value} <div class="deleteButton hidden">⨯</div>`;
    parent.appendChild(item);
  }

  thisField(parent, data) {
    for (let i = 0; i < data.length; i += 1) {
      this.newItem(parent, data[i]);
    }
  }

  allFields(data) {
    this.thisField(this.toDo, data.todo);
    this.thisField(this.inProgress, data.inProgress);
    this.thisField(this.done, data.done);
  }
}
