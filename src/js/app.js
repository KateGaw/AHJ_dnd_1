import DrawUI from './DrawUI';

const drawUI = new DrawUI();
const main = document.querySelector('#main');

document.addEventListener('DOMContentLoaded', () => {
  const localStorageData = JSON.parse(localStorage.getItem('main'));
  drawUI.allFields(localStorageData);
});


function saveToLocalStorage() {
  const tasks = { todo: [], inProgress: [], done: [] };
  for (const i of document.querySelectorAll('#todo .taskItems .item')) {
    tasks.todo.push(i.innerText.replace('⨯', ''));
  }
  for (const i of document.querySelectorAll('#in-progress .taskItems .item')) {
    tasks.inProgress.push(i.innerText.replace('⨯', ''));
  }
  for (const i of document.querySelectorAll('#done .taskItems .item')) {
    tasks.done.push(i.innerText.replace('⨯', ''));
  }
  localStorage.setItem('main', JSON.stringify(tasks));
}


// ADD-CANCEL-DELETE
main.addEventListener('click', (event) => {
  // Add another card
  if (event.target.classList.contains('addButton')) {
    event.target.parentNode.querySelector('.taskInput').classList.remove('hidden');
    event.target.classList.add('hidden');
  }

  // cancel button in taskInput
  if (event.target.classList.contains('cancelTButton')) {
    event.target.parentNode.parentNode.classList.add('hidden');
    event.target.parentNode.parentNode.parentNode.querySelector('.addButton').classList.remove('hidden');
    const input = event.target.closest('.taskInput').querySelector('#text');
    input.value = '';
  }

  // add button in taskInput
  if (event.target.classList.contains('addTButton')) {
    const tasks = event.target.closest('.taskList').querySelector('.taskItems');
    const input = event.target.closest('.taskInput').querySelector('#text');

    if (input.value !== '') {
      drawUI.newItem(tasks, input.value);
      input.value = '';
      saveToLocalStorage();
    }
    event.target.parentNode.parentNode.classList.add('hidden');
    event.target.parentNode.parentNode.parentNode.querySelector('.addButton').classList.remove('hidden');
  }

  // delete button
  if (event.target.classList.contains('deleteButton')) {
    const delTask = event.target.parentNode;
    delTask.parentNode.removeChild(delTask);
    saveToLocalStorage();
  }
});

const DnD = (event, element) => {
  const near = document.elementFromPoint(event.clientX, event.clientY);
  const { top } = near.getBoundingClientRect();

  if (near.classList.contains('item')) {
    if (event.pageY >= (window.scrollY + top + near.offsetHeight / 2)) {
      near.closest('.taskItems').insertBefore(element, near.nextElementSibling);
    } else near.closest('.taskItems').insertBefore(element, near);
  } else if (near.classList.contains('taskItems') && !near.querySelector('.item')) {
    near.append(element);
  }
};

// MOVING
main.onmousedown = function (event) {
  if (event.target.classList.contains('item')) {
    let movingElement = event.target;
    const elWidth = movingElement.offsetWidth;
    const elHeight = movingElement.offsetHeight;

    const { top, left } = event.target.getBoundingClientRect();
    const leftEl = event.pageX - left;
    const topEl = event.pageY - top;

    let ghostEl = event.target.cloneNode(true);
    ghostEl.classList.add('ghost');

    movingElement.classList.add('moving');
    event.target.parentNode.insertBefore(ghostEl, event.target.nextElementSibling);

    movingElement.style.left = `${event.pageX - leftEl}px`;
    movingElement.style.top = `${event.pageY - topEl}px`;
    movingElement.style.width = `${elWidth}px`;
    movingElement.style.height = `${elHeight}px`;

    main.addEventListener('mousemove', (ev) => {
      if (movingElement) {
        ev.preventDefault();
        DnD(ev, ghostEl);
        movingElement.style.left = `${ev.pageX - leftEl}px`;
        movingElement.style.top = `${ev.pageY - topEl}px`;
      }
    });

    const upOrLeave = () => {
      ghostEl.parentNode.removeChild(ghostEl);
      movingElement.classList.remove('moving');
      movingElement.style = '';
      ghostEl = null;
      movingElement = null;
    };

    main.addEventListener('mouseup', (evt) => {
      if (movingElement) {
        DnD(evt, movingElement);
        upOrLeave();
        saveToLocalStorage();
      }
    });

    main.addEventListener('mouseleave', (e) => {
      if (movingElement) {
        e.preventDefault();
        upOrLeave();
      }
    });
  }
};
