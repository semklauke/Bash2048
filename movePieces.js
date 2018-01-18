function newPiece(e,t){return{value:parseInt(e),merged:!!t,old:null}}
function getDirections(){return[{x:0,y:1},{x:1,y:0},{x:0,y:-1},{x:-1,y:0}]}
function getPieceLvl(e){return Math.log(parseInt(e.value))/Math.log(2)}
function Board(e){this.pieces=e,this.playerMoved=!1}
Board.prototype.getLvl=function(e){if(this.onBoard(e)){var t=this.getPiece(e);if(null!=t&&void 0!=t)return getPieceLvl(t)}return 0};
Board.prototype.addPiece=function(e,t){this.pieces[e.x][e.y]=t},Board.prototype.removePiece=function(e){this.pieces[e.x][e.y]=null};
Board.prototype.onBoard=function(e){return e.x<0||e.x>3?!1:e.y<0||e.y>3?!1:!0};
Board.prototype.getPiece=function(e){return this.onBoard(e)?this.pieces[e.x][e.y]:null};
Board.prototype.freePiece=function(e){return null==this.getPiece(e)?!0:!1};
Board.prototype.updatePosistion=function(e,t){var r=this.getPiece(e);r.old={x:e.x,y:e.y},this.addPiece(t,r),this.removePiece(e)};
Board.prototype.copy=function(){for(var e=new Board(!1),t=0;4>t;t++)e.pieces[t]=this.pieces[t].slice();return e};
Board.prototype.clearMerge=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)null!=this.pieces[e][t]&&(this.pieces[e][t].merged=!1)};
Board.prototype.freePieces=function(){for(var e=[],t=0;4>t;t++)for(var r=0;4>r;r++)null==this.getPiece({x:t,y:r})&&e.push({x:t,y:r});return e};
Board.prototype.moveBoard=function(e,t,r){this.clearMerge();var o=!1;if(1==this.playerMoved)return o;for(var i=1!=e?[0,1,2,3]:[3,2,1,0],n=1!=t?[0,1,2,3]:[3,2,1,0],a=0;4>a;a++)for(var s=0;4>s;s++){var c={x:i[a],y:n[s]},u={x:i[a],y:n[s]},p=this.getPiece(c);if(null!=p){var l;e:for(;;){if(c.x+=e,c.y+=t,!this.onBoard(c)){l={pos:{x:c.x-e,y:c.y-t},next:null};break e}if(!this.freePiece(c)){l={pos:{x:c.x-e,y:c.y-t},next:this.getPiece(c),nextPos:c};break e}}null==l.next||l.next.merged||l.next.value!=p.value?(u.x!=l.pos.x||u.y!=l.pos.y)&&(this.updatePosistion(u,l.pos),o=!0,void 0!==r&&r(u,l.pos,!1)):(this.addPiece(l.nextPos,newPiece(2*p.value,!0)),this.removePiece(u),o=!0,void 0!==r&&r(u,l.nextPos,!0))}}return this.playerMoved=!0,o};
Board.prototype.addRandomPiece=function(){for(var e=newPiece(Math.random()<.9?2:4),t=[],r=0;4>r;r++)for(var o=0;4>o;o++)null==this.pieces[r][o]&&t.push({x:r,y:o});if(0==t.length)return null;var i=t[Math.round(Math.random()*(t.length-1))];return this.addPiece(i,e),{pos:i,value:e.value}};


function parsePieceToString(p) {
	if (p == null)
		return "[_____];";
	var v = p.value;
	if (v <= 8)
		return "[__"+v+"__];";
	else if (v <= 64)
		return "[__"+v+"_];";
	else if (v <= 512)
		return "[_"+v+"_];";
	else if (v <= 4096)
		return "[_"+v+"];";
	else return "["+v+"];";
}

Board.prototype.printPieces = function() {
	var out = "";
	for (var i = 3; i >= 0; i--) {
		for (var j = 0; j < 4; j++) {
			out += parsePieceToString(this.pieces[j][i]);
		}
	}
	return out;
};


var _args = process.argv.slice(2);
var _inputPieces = [];
for (var i = 0; i < 4; i++) {
	_inputPieces[i] = []
}


/* -- parse input -- */
var pin = _args[0];

for (var i = 3; i >= 0; i--) {
	for (var j = 0; j < 4; j++) {
		var c = pin.split(";")[0].slice(1,6).replace(/_/g, "");
		_inputPieces[j][i] = c == "" ? null : newPiece(c, false);
		if (_inputPieces[j][i] == NaN || _inputPieces[i][j] == "NaN")
			console.log(c);
		pin = pin.slice(8);
	}
}

 /* -- -- */

var _x = 0;
var _y = 0;
switch (_args[1]) {
	case "up":
		//up
		_y = 1;
		break;
	case "down":
		//down
		_y = -1;
		break;
	case "left":
		//left
		_x = -1;
		break;
	case "right":
		//right
		_x = 1;
		break;
}
var _board = new Board(_inputPieces);
if (_board.moveBoard(_x, _y))
	_board.addRandomPiece();
console.log(_board.printPieces());

