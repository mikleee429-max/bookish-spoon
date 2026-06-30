// Sudoku Game
class Sudoku{
  constructor(container, options={}){
    this.container = container;
    this.options = options;
    this.board = [5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,0,6,0,8,0,0,0,6,0,0,0,4,0,0,8,0,3,0,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,0,5,0,0,0,0,8,0,0,7,9];
    this.original = JSON.parse(JSON.stringify(this.board));
    this.init();
  }
  init(){ this.render(); }
  render(){ const el = document.getElementById('sudoku') || document.createElement('div'); el.innerHTML = `<div class="card"><h3>🔢 Судоку</h3><div class="sudoku-board"></div></div>`; const board = el.querySelector('.sudoku-board'); this.board.forEach((v,i)=>{ const cell=document.createElement('input'); cell.type='number'; cell.className='sudoku-cell'; cell.min=1; cell.max=9; cell.value = v||''; if(this.original[i]!==0) cell.disabled=true; board.appendChild(cell); }); }
}
